# -*- encode: utf-8 -*-

from BeautifulSoup import BeautifulSoup
import re,urllib2
import urllib
import HTMLParser

year = "2012"
month = "august"
DAY = 2

url = "http://clubrocknroll.jp/schedule/"+ year +"/"+ month +".html"
html = urllib2.urlopen(url).read()
soup = BeautifulSoup(html)

dates = []
titles = []
bands = []
times = []

titleList = []
dateList = []
bL = [] 
bandList = []
timeList = []

dates = soup.findAll('h2',{'class':'date_title'})

for date in dates:
    dateList.append(date.renderContents())


titles = soup.findAll('h3', {'class':'event_title'})

for title in titles:
    cont = ''.join([str(t) for t in title.contents[:]])
    intext = re.sub("<[^>]*>", "", cont)
    intext = re.sub("\r","", intext)
    intext = re.sub("&amp;","&",intext)

    titleList.append(intext)

bands = soup.findAll('div',{'class':'band'})
for band in bands:
    band = band.findAll('p')
    for ban in band:
        cont = ''.join([str(t) for t in ban.contents[:]])
        intext = re.sub("<[^>]*>", "", cont)
        intext = re.sub("&nbsp;","",intext)
        intext = re.sub("\n","",intext)
        intext = re.sub("\r","", intext)
        intext = re.sub("&amp;","&",intext)
        bL.append(intext)
    bandList.append(bL)
    bL = []

times = soup.findAll('p',{'class':'detail'})
for time in times:
    cont = ''.join([str(t) for t in time.contents[:]])
    intext = re.sub("<[^>]*>", "", cont)
    intext = re.sub("&nbsp;","",intext)
    intext = re.sub("\n","",intext)
    intext = re.sub(" ", "",intext)
    intext = re.sub("\t","",intext)
    intext = re.sub("\r","", intext)
    intext = re.sub("&amp;","&",intext)

    timeList.append(intext)
    


eventsList = zip(dateList, titleList, bandList, timeList)



for eventList in eventsList:
    (date, title, bands, time) = eventList
    print '*'*75
    print date
    print time
    print '-'*50
    print ' '*5,title
    print '-'*50
    print ' + Artists'
    print ', '.join(bands)
    
