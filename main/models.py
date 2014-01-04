from django.db import models
from django.db.models.fields import *
from django.contrib.auth.models import User

from sortedm2m.fields import SortedManyToManyField

class Song(models.Model):
    url = URLField()
    time_requested = DateTimeField(auto_now_add=True)

class Playlist(models.Model):
    songs = SortedManyToManyField(Song, sort_value_field_name = "time_requested")
    user = models.OneToOneField(User)