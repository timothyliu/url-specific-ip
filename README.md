URL-SPECIFIC-IP
=================

# 功能
指定 ip 和 url 代理執行 http get

# 運作模式／代理方式
## 案例
* 以 browser 瀏覽：

  ``http://localhost:3000/proxy/http%3A%2F%2Fwww.anns.tw%2Fwebapi%2FShop%2FGetShopCategoryList%3Fid%3D123%26v%3D0/tyo-mweb1.nineyi.corp``

* 先以指定 ip/domain (mweb1.nineyi.corp) 建立連線後，再發出下列 http get: 

```http
GET /webapi/Shop/GetShopCategoryList?id=123&v=0?id=123&v=0 HTTP/1.1
host: www.anns.tw
cache-control: max-age=0upgrade-insecure-requests: 1
user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36
accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
accept-encoding: gzip, deflate, sdch
accept-language: zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4,zh-CN;q=0.2
if-modified-since: Sun, 07 Aug 2016 01
```

* HTTP headers

  * 會將原先的 headers 也都會代理發送

  * 會將 server response headers 也會一併送回

  * 回應時增加一個 header: `real-server-ip` 即原來指定的 ip/domain

```http
Access-Control-Allow-Credentials:true
Access-Control-Allow-Origin:http
Cache-Control:public, max-age=600
Connection:keep-alive
Content-Encoding:gzip
Content-Length:3029
Content-Type:application/json; charset=utf-8
Date:Sun, 07 Aug 2016 02
Expires:Sun, 07 Aug 2016 02
Last-Modified:Sun, 07 Aug 2016 02
NS-VaryByCustom-Key:www.anns.tw
real-server-ip:tyo-mweb1.nineyi.corp
statusCode:200
Vary:*
X-Content-Type-Options:nosniff
X-Frame-Options:SAMEORIGIN
X-Powered-By:Express
X-Xss-Protection:1; mode=block
```