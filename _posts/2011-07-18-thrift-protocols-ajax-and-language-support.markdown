---
layout: default
status: publish
published: true
title: Thrift Protocols, AJAX, and Language Support
author: Sean
author_login: Sean
author_email: sean.houghton@gmail.com
wordpress_id: 804
wordpress_url: http://www.cerebiggum.com/?p=804
date: '2011-07-18 14:35:04 -0700'
date_gmt: '2011-07-18 22:35:04 -0700'
categories:
- Programming
tags: []
---
<p>Two of the major strengths of Thrift are its support for a wide range of languages as well as its collection of available protocols. However, not every protocol is available for every language and not all protocols perform the same. I've spent a little time researching these issues and this is a quick summary of the results.</p>
<h3>Language Support</h3><br />
Thrift supports a wide range of languages, but the support is not uniform. It's clear that C++ is the primary language given that it supports all the protocols.</p>
<p>You can always extend thrift and build your own implementation using whatever language you want, but this is what comes stock.</p>
<p>[caption id="attachment_806" align="aligncenter" width="381" caption="Implemented Thrift protocols in v0.6.1."]<a href="{{site.url_root}}/assets/data/wp/wp/2011/07/Thrift-Protocol-Compatibility.png"><img class="size-full wp-image-806" title="Thrift-Protocol-Compatibility" src="{{site.url_root}}/assets/data/wp/wp/2011/07/Thrift-Protocol-Compatibility.png" alt="" width="381" height="341" /></a>[/caption]</p>
<p>The spotty protocol support is really only a problem with JSON. If you want your endpoint to work with JavaScript clients (i.e. web pages) you'll need your server to provide an HTTP transport with the JSON protocol. However, the binary protocol is much more compact and is probably best for high throughput services. So which do you choose? I would suggest exposing multiple endpoints, each serving a different protocol.</p>
<p>The following code is a C# implementation of an IHttpHandler for ASP.NET that allows you to choose the protocol as a URL parameter. For example:</p>
<pre>http://myserver.com/thrift.ashx?protocol=json</pre></p>
<pre name="code" class="c#">
// based on code in https://issues.apache.org/jira/browse/THRIFT-322<br />
using System;<br />
using System.Web;<br />
using Telemetry.Server.Thrift;<br />
using Thrift;<br />
using Thrift.Protocol;<br />
using Thrift.Transport;</p>
<p>namespace Shell.Web<br />
{<br />
    public class ThriftRequestHandler<br />
    {<br />
        private readonly TProcessor _processor;<br />
        private readonly TProtocolFactory _inputProtocolFactory;<br />
        private readonly TProtocolFactory _outputProtocolFactory;</p>
<p>        public ThriftRequestHandler(TProcessor processor, TProtocolFactory inputProtocolFactory, TProtocolFactory outputProtocolFactory)<br />
        {<br />
            _processor = processor;<br />
            _inputProtocolFactory = inputProtocolFactory;<br />
            _outputProtocolFactory = outputProtocolFactory;<br />
        }</p>
<p>        public void ProcessRequest(HttpContext context)<br />
        {<br />
            context.Response.ContentType = "application/x-thrift";<br />
            context.Response.ContentEncoding = System.Text.Encoding.UTF8;</p>
<p>            var transport = new TStreamTransport(context.Request.InputStream, context.Response.OutputStream);<br />
            try<br />
            {<br />
                var inputProtocol = _inputProtocolFactory.GetProtocol(transport);<br />
                var outputProtocol = _outputProtocolFactory.GetProtocol(transport);</p>
<p>                while (_processor.Process(inputProtocol, outputProtocol))<br />
                {</p>
<p>                }<br />
            }<br />
            catch (TTransportException)<br />
            {<br />
                // Client died, just move on<br />
            }<br />
            catch (TApplicationException tx)<br />
            {<br />
                Console.Error.Write(tx);<br />
            }<br />
            catch (Exception x)<br />
            {<br />
                Console.Error.Write(x);<br />
            }</p>
<p>            transport.Close();<br />
        }<br />
    }</p>
<p>    public class Thrift : IHttpHandler<br />
    {<br />
        private readonly ThriftRequestHandler _jsonHandler =<br />
            new ThriftRequestHandler(<br />
                new TelemetryThriftService.Processor(new TelemetryHandler()), new TJSONProtocol.Factory(), new TJSONProtocol.Factory());</p>
<p>        private readonly ThriftRequestHandler _binaryHandler =<br />
            new ThriftRequestHandler(<br />
                new TelemetryThriftService.Processor(new TelemetryHandler()), new TBinaryProtocol.Factory(), new TBinaryProtocol.Factory());</p>
<p>        public void ProcessRequest(HttpContext context)<br />
        {<br />
            if(string.Compare(context.Request.Params["protocol"], "json", StringComparison.InvariantCultureIgnoreCase) == 0)<br />
            {<br />
                _jsonHandler.ProcessRequest(context);<br />
            }<br />
            else<br />
            {<br />
                _binaryHandler.ProcessRequest(context);<br />
            }<br />
        }</p>
<p>        public bool IsReusable<br />
        {<br />
            get { return true; }<br />
        }<br />
    }<br />
}<br />
</pre></p>
<p>Note: serving JSON to web pages that use the XMLHTTPRequest object require a server that handles the "OPTION" request if you're using a cross-site service. None of the included HTTP transports currently handle this request type. This means the simple, autogenerated C++ skeleton apps wont work with AJAX clients.  I've added support for this in the C++ template in my fork of thrift on <a href="https://github.com/seanhoughton/thrift" target="_blank">GitHub</a>. If you expose your service on the same host that's serving web pages you don't need to worry about it because no cross-site communication is happening.</p>
<h3>Performance</h3><br />
The <a href="https://github.com/eishay/jvm-serializers/wiki/">JVM-Serializers</a> project on GitHub provides detailed performance measurements for Thrift and compares them with other RPC frameworks such as Google's protobuf. It doesn't cover all of the protocols available in Thrift, but it's a good source for comparing the binary protocol against other frameworks.</p>
