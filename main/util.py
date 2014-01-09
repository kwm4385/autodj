import urllib, time
import requests

def youtube_is_valid(url):
    parsed_url = urllib.parse.urlparse(url)
    if 'v' in urllib.parse.parse_qs(parsed_url.query).keys():
        vid = urllib.parse.parse_qs(parsed_url.query)['v'][0]
        r = requests.get('https://gdata.youtube.com/feeds/api/videos/' + vid)
        if r.status_code is 200:
            return True
    return False

def seconds_to_hms(seconds):
    return time.strftime('%H:%M:%S', time.gmtime(seconds)).lstrip('0').lstrip(':')
