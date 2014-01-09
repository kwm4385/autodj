from django.db import models
from django.db.models.fields import *
from django.db.models.signals import pre_delete, post_init
from django.contrib.auth.models import User
from django.dispatch import receiver

from uuid import uuid4

from registration.signals import user_registered

from sortedm2m.fields import SortedManyToManyField

from main import util

import urllib

import requests

class Song(models.Model):
    url = models.URLField()
    time_requested = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=(100), default="Song title")
    duration = models.CharField(max_length=10, default="0:00")

    def __str__(self):
        return self.url

class Playlist(models.Model):
    songs = SortedManyToManyField(Song, sort_value_field_name = "time_requested")
    user = models.ForeignKey(User)
    name = models.CharField(max_length = 30, default = "Unnamed Platlist")
    is_requests = models.BooleanField(default = True)

    def __str__(self):
        return self.name

##                ##
# Signal Recievers #
##                ##

@receiver(post_init)
def get_song_data(sender, instance, **kwargs):
    if sender == Song:
        parsed_url = urllib.parse.urlparse(instance.url)
        yt_id = urllib.parse.parse_qs(parsed_url.query)['v'][0]
        json = requests.get('http://gdata.youtube.com/feeds/api/videos/'+yt_id+'?v=2&alt=jsonc').json()
        instance.title = json['data']['title']
        instance.duration = util.seconds_to_hms(int(json['data']['duration']))
        instance.save()

@receiver(user_registered)
def on_user_register(sender, **kwargs):
    req_playlist = Playlist(user = kwargs["user"], name = kwargs["user"].username + "'s request playlist")
    playlist = Playlist(is_requests = False, user = kwargs["user"], name = kwargs["user"].username + "'s personal playlist")
    playlist.save()
    req_playlist.save()

@receiver(pre_delete)
def delete_repo(sender, instance, **kwargs):
    if sender == User:
        playlists = Playlist.objects.filter(user = instance)
        for pl in playlists:
            pl.delete()
    elif sender == Playlist:
        for song in instance.songs.all():
            song.delete()