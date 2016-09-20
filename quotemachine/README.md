Quotes available from this API
https://www.mediawiki.org/wiki/API:Main_page

https://theysaidso.com/api/#

curl -v  -i -X GET http://quotes.rest/qod.json
Note: Unnecessary use of -X or --request, GET is already inferred.
*   Trying 64.111.106.203...
* Connected to quotes.rest (64.111.106.203) port 80 (#0)
> GET /qod.json HTTP/1.1
> Host: quotes.rest
> User-Agent: curl/7.47.0
> Accept: */*
> 
< HTTP/1.1 200 OK
HTTP/1.1 200 OK
< Date: Tue, 20 Sep 2016 00:45:53 GMT
Date: Tue, 20 Sep 2016 00:45:53 GMT
< Server: Apache
Server: Apache
< Access-Control-Allow-Origin: *
Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET,POST,PUT,OPTIONS
Access-Control-Allow-Methods: GET,POST,PUT,OPTIONS
< Access-Control-Allow-Headers: x-access-token
Access-Control-Allow-Headers: x-access-token
< X-Auth-Status: true
X-Auth-Status: true
< X-RateLimit-Limit: 10 per hour
X-RateLimit-Limit: 10 per hour
< X-RateLimit-Remaining: 10
X-RateLimit-Remaining: 10
< Cache-Control: private, max-age=43200, pre-check=86400, post-check=43200
Cache-Control: private, max-age=43200, pre-check=86400, post-check=43200
< Expires: Tue, 20 Sep 2016 12:45:53 GMT
Expires: Tue, 20 Sep 2016 12:45:53 GMT
< X-Powered-By: Luracast Restler v3.0.0rc3
X-Powered-By: Luracast Restler v3.0.0rc3
< Content-Language: en
Content-Language: en
< Transfer-Encoding: chunked
Transfer-Encoding: chunked
< Content-Type: application/json; charset=utf-8
Content-Type: application/json; charset=utf-8

< 
{
    "success": {
        "total": 1
    },
    "contents": {
        "quotes": [
            {
                "quote": "Time to improve is limited. The clock is always on and doesn't care if you don't feel like it. Someone else does and they're passing you by.",
                "length": "140",
                "author": "William James Moore",
                "tags": [
                    "hustle",
                    "inspire",
                    "self-improvement"
                ],
                "category": "inspire",
                "date": "2016-09-20",
                "title": "Inspiring Quote of the day",
                "background": "https://theysaidso.com/img/bgs/man_on_the_mountain.jpg",
                "id": "PntHDpB8PzT4bzVGbD1CQQeF"
            }
        ]
    }
* Connection #0 to host quotes.rest left intact
}
