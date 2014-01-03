from django.shortcuts import render
from django.contrib.auth.forms import UserCreationForm 
from django.contrib.auth import *
from django.contrib.auth.decorators import login_required
from django.shortcuts import *
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseForbidden
from django.template import RequestContext, loader

from registration.forms import RegistrationForm
from registration.backends.simple.views import RegistrationView

def register_home(request):
    if request.method == 'POST': # If the form has been submitted
        form = RegistrationForm(request.POST)
        if form.is_valid():
            usr, em, pw = form.cleaned_data['username'], form.cleaned_data['email'], form.cleaned_data['password1']
            user = RegistrationView.register(RegistrationView, request=request, username=usr, email=em, password1=pw)
            return HttpResponseRedirect("/")
        else:
            return render(request, 'home.html', {'regform': form, 'anchor': 'register'})
    else: # Otherwise display registration page
        if request.user.is_authenticated():
            return HttpResponseRedirect("/")
        else:
            form = RegistrationForm()
            return render(request, 'home.html', {'regform': form,})