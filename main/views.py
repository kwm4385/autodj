from django.shortcuts import render
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import *
from django.contrib.auth.decorators import login_required
from django.shortcuts import *
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseForbidden
from django.template import RequestContext, loader

from registration.forms import RegistrationFormUniqueEmail
from registration.backends.simple.views import RegistrationView

from main.models import *

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

