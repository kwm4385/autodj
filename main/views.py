from django.shortcuts import render
from django.contrib.auth.forms import UserCreationForm 
from django.contrib.auth import *
from django.contrib.auth.decorators import login_required
from django.shortcuts import *
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseForbidden
from django.template import RequestContext, loader

from registration.forms import RegistrationForm

def register_home(request):
    if request.method == 'POST': # If the form has been submitted
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
        else:
            return render(request, 'home.html', {'regform': form,})
    else: # Otherwise display registration page
        if request.user.is_authenticated():
            return HttpResponseRedirect("/")
        else:
            form = RegistrationForm()
            return render(request, 'home.html', {'regform': form,})