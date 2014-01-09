from django.shortcuts import render
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import *
from django.contrib.auth.decorators import login_required
from django.shortcuts import *
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseForbidden
from django.template import RequestContext, loader

import urllib

from registration.forms import RegistrationFormUniqueEmail
from registration.backends.simple.views import RegistrationView

from main.models import *
from main import util

ALLOWED_SONG_HOSTS = [
    'www.youtube.com',
]

def register_home(request):
    loginform = AuthenticationForm()
    if request.method == 'POST': # If the form registration has been submitted
        form = RegistrationFormUniqueEmail(request.POST)
        if form.is_valid():
            usr, em, pw = form.cleaned_data['username'], form.cleaned_data['email'], form.cleaned_data['password1']
            user = RegistrationView.register(RegistrationView, request=request, username=usr, email=em, password1=pw)
            return HttpResponseRedirect("/playlist")
        else:
            return render(request, 'home.html', {'regform': form, 'anchor': 'register','loginform': loginform,})
    else:
        form = RegistrationFormUniqueEmail()
        return render(request, 'home.html', {'regform': form, 'loginform': loginform,})

@login_required
def playlist(request):
    library_songs = Playlist.objects.get(user=request.user, is_requests=False).songs.all()
    return render(request, 'playlist/playlist.html', {'library_songs':library_songs,})

@login_required
def add_library_song(request):
    song_url = request.POST["songurl"]
    user_playlist = Playlist.objects.get(user = request.user, is_requests=False)
    if request.method == 'POST':
        if not user_playlist.songs.all().filter(url=song_url).exists():
            parsed_url = urllib.parse.urlparse(song_url)
            if parsed_url[1] in ALLOWED_SONG_HOSTS:
                if util.youtube_is_valid(song_url):
                    song = Song(url=song_url)
                    song.save()
                    user_playlist.songs.add(song)
                    user_playlist.save()
                    msg = "success"
                else:
                    msg = "err-parameter"
            else:
                msg = "err-domain"
        else:
            msg = "err-unique"
    else:
        msg = "GET not allowed"
    return HttpResponse(msg)