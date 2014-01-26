from django.shortcuts import render
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import *
from django.contrib.auth.decorators import login_required
from django.shortcuts import *
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseForbidden
from django.template import RequestContext, loader

import urllib
import json

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
    return render(request, 'playlist/playlist.html', {})

@login_required
def get_library_songs(request):
    library_songs = Playlist.objects.get(user=request.user, is_requests=False).songs.all()
    return render(request, 'playlist/library_table.html', {'library_songs':library_songs,})
    
@login_required
def add_library_song(request):
    if request.method == 'POST':
        song_url = request.POST["songurl"]
        user_playlist = Playlist.objects.get(user = request.user, is_requests=False)
        if not user_playlist.songs.all().filter(url=song_url).exists():
            parsed_url = urllib.parse.urlparse(song_url)
            if parsed_url[1] in ALLOWED_SONG_HOSTS:
                if util.youtube_is_valid(song_url):
                    song = Song(url=song_url)
                    song.save()
                    user_playlist.songs.add(song)
                    user_playlist.save()
                    msg = "suc-Song successfully added."
                else:
                    msg = "err-URL does not appear to be a valid YouTube video."
            else:
                msg = "err-Only YouTube links are supported at this time."
        else:
            msg = "err-This song is already in your library."
    else:
        return HttpResponseRedirect("/playlist")
    return HttpResponse(msg)

@login_required
def delete_library_song(request):
    if request.method == 'POST':
        song_id = int(request.POST["songid"][0])
        user_playlist = Playlist.objects.get(user = request.user, is_requests=False)
        if user_playlist.songs.all().filter(pk=song_id).exists():
            song = user_playlist.songs.all().get(pk=song_id)
            song.delete()
            return HttpResponse("success")
        else:
            return HttpResponseForbidden()
    return HttpResponseRedirect("/playlist")

@login_required
def get_request_playlist(request):
     request_playlist = Playlist.objects.get(user=request.user, is_requests=True)
     response_data = request_playlist.as_dict()
     return HttpResponse(json.dumps(response_data), content_type="application/json")