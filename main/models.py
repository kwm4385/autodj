from django.db import models
from django.db.models.fields import *
from django.db.models.signals import pre_delete
from django.contrib.auth.models import User
from django.dispatch import receiver

from registration.signals import user_registered

from sortedm2m.fields import SortedManyToManyField

class Song(models.Model):
    url = URLField()
    time_requested = DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.url

class Playlist(models.Model):
    songs = SortedManyToManyField(Song, sort_value_field_name = "time_requested")
    user = models.OneToOneField(User)
    name = models.CharField(max_length = 30, default="Unnamed Platlist")

    def __str__(self):
        return self.name

##                ##
# Signal Recievers #
##                ##

@receiver(user_registered)
def on_user_register(sender, **kwargs):
    playlist = Playlist(user = kwargs["user"], name = kwargs["user"].username + "'s playlist")
    playlist.save()

@receiver(pre_delete)
def delete_repo(sender, instance, **kwargs):
    if sender == User:
        playlist = Playlist.objects.filter(user = instance)
        playlist.delete()
    elif sender == Playlist:
        for song in instance.songs.all():
            song.delete()