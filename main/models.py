from django.db import models
from django.db.models.fields import *
from django.db.models.signals import pre_delete
from django.contrib.auth.models import User
from django.dispatch import receiver

from uuid import uuid4

from registration.signals import user_registered

from sortedm2m.fields import SortedManyToManyField

class Song(models.Model):
    url = URLField()
    time_requested = DateTimeField(auto_now_add=True)

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