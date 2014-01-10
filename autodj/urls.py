from django.conf.urls import patterns, include, url
from django.contrib import admin

from main import views

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    (r'^accounts/', include('registration.backends.simple.urls')),
    (r'^$', views.register_home),
    (r'^playlist/$', views.playlist),
    (r'^playlist/librarysongs/$', views.get_library_songs),
    (r'^playlist/addlibrarysong/$', views.add_library_song),
    (r'^playlist/deletelibrarysong/$', views.delete_library_song),
    
)