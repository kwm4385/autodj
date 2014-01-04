from django.dispatch import receiver

from registration.signals import user_registered

from models import Playlist

@receiver(user_registered)
def on_user_register(sender, **kwargs):
    print("User registered.")
    playlist = Playlist(user = user)
    playlist.save()
