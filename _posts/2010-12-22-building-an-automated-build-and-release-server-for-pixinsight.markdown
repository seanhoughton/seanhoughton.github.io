---
layout: default
status: publish
published: true
title: Building an Automated Build and Release Server for PixInsight
author: Sean
author_login: Sean
author_email: sean.houghton@gmail.com
wordpress_id: 674
wordpress_url: http://www.cerebiggum.com/?p=674
date: '2010-12-22 00:43:27 -0800'
date_gmt: '2010-12-22 08:43:27 -0800'
categories:
- Programming
tags:
- Astrophotography
- PixInsight
---
<p>PixInsight 1.6.9 introduced a new automated update system - a system that allows developers to easily deploy updates as soon as they are ready. &Acirc;&nbsp;Automated deployment can be&Acirc;&nbsp;both&Acirc;&nbsp;amazingly convenient for your users and a complete nightmare for the developer. Without proper automation accidents will happen and user experience will suffer. &Acirc;&nbsp;This post details a method for automating the deployment of your software in an effort to minimize defective releases. &Acirc;&nbsp;The example content is a simple PJSR script, but the described method applies to PCL modules.</p>
<h3>Raw materials.</h3></p>
<ul>
<li>Web server with a domain name and FTP access. &Acirc;&nbsp;I use [<a title="dreamhost.com" href="http://dreamhost.com" target="_blank">dreamhost.com</a>], use my promo code PIXINSIGHT for a discount.</li>
<li>Revision control server. &Acirc;&nbsp;I use [<a href="http://github.com" target="_blank">github.com</a>]</li>
<li>Jenkins (previously known as Hudson) continuous integration server [<a href="http://jenkins-ci.org" target="_blank">jenkins-ci.org</a>]</li>
<li>OpenSSL command line tools [<a href="http://www.openssl.org/" target="_blank">www.openssl.org</a>]</li>
<li>Java runtime [<a href="http://www.java.com/en/download/" target="_blank">java.com</a>]</li><br />
</ul></p>
<h3>Setting Up The Build Server</h3><br />
Jenkins is a continuous integration server. &Acirc;&nbsp;A continuous integration server can do many things for you but it's main purpose is to automatically pull the most recent version of code from a repository any time it changes and perform some type of operation on it. &Acirc;&nbsp;Most CI servers provide additional functionality for managing build artifacts and Jenkins is no exception. &Acirc;&nbsp;We're going to use Jenkins to bundle up our script in the required format and upload the result to our web server.</p>
<p>After downloading Jenkins you need to start it on the command line:</p>
<pre name="code" class="cpp">
java -jar jenkins.war<br />
</pre><br />
Jenkins is now running and you can configure a new job using a web browser.  The default Jenkins instance can be accessed at <a href="http://localhost:8080" target="_blank">http://localhost:8080</a></p>
<p>We'll be using the FTP Upload plugin in our job so we should install and set it up first.  You can install this from within Jenkins's plugin manager, <em>Manage Jenkins -> Manage Plugins -> Available</em>.  You may need to install a plugin for your revision control provider here too.  Once it's installed you'll need to restart Jenkins.</p>
<p>[caption id="attachment_681" align="aligncenter" width="463" caption="Fig. 1  Installing the FTP Uploader plugin"]<a href="{{site.url_root}}/assets/data/wp/wp/2010/12/FtpPlugin.png"><img class="size-full wp-image-681" title="FtpPlugin" src="{{site.url_root}}/assets/data/wp/wp/2010/12/FtpPlugin.png" alt="" width="463" height="90" /></a>[/caption]</p>
<p>The plugin lets you build a predefined list of servers that each job can use.  We'll set up a connection on the global configuration page, <em>Manage Jenkins -> Configure System</em>.</p>
<p>[caption id="attachment_679" align="aligncenter" width="555" caption="Fig. 2  Setting up an FTP connection"]<a href="{{site.url_root}}/assets/data/wp/wp/2010/12/FtpSetup.png"><img class="size-full wp-image-679" title="FtpSetup" src="{{site.url_root}}/assets/data/wp/wp/2010/12/FtpSetup.png" alt="" width="555" height="260" /></a>[/caption]</p>
<h3>Creating a Build Job</h3><br />
Now we're ready to create our job.  Select "New Job" from the menu.</p>
<p>[caption id="attachment_676" align="aligncenter" width="565" caption="Fig. 3 Creating a new job in Jenkins"]<a href="{{site.url_root}}/assets/data/wp/wp/2010/12/NewJob.png"><img class="size-full wp-image-676" title="NewJob" src="{{site.url_root}}/assets/data/wp/wp/2010/12/NewJob.png" alt="" width="565" height="499" /></a>[/caption]</p>
<p>The job will pull code from our revision control repository.</p>
<p>[caption id="attachment_675" align="aligncenter" width="545" caption="Fig. 4  Configuring a GitHub repository for our job"]<a href="{{site.url_root}}/assets/data/wp/wp/2010/12/GitHub.png"><img class="size-full wp-image-675" title="GitHub" src="{{site.url_root}}/assets/data/wp/wp/2010/12/GitHub.png" alt="" width="545" height="377" /></a>[/caption]</p>
<p>The job should run every time a change is submitted.</p>
<p>[caption id="attachment_682" align="aligncenter" width="541" caption="Fig. 5  Polling the SCM repository"]<a href="{{site.url_root}}/assets/data/wp/wp/2010/12/ScmPolling1.png"><img class="size-full wp-image-682" title="ScmPolling" src="{{site.url_root}}/assets/data/wp/wp/2010/12/ScmPolling1.png" alt="" width="541" height="165" /></a>[/caption]</p>
<p>At this point the job is configured to trigger whenever a code change happens but it doesn't actually do anything with the downloaded code. &Acirc;&nbsp;We need to add some build actions to bundle up the content into a format that is ready to put on the web server and that PixInsight will understand.  In this example we are running Jenkins in OSX so we're using the "Execute Shell" action, Windows users will need to use "Execute Windows Batch Command" instead.</p>
<p>First we need to build a compressed file containing the script. &Acirc;&nbsp;Our plugin was developed without any subdirectories. &Acirc;&nbsp;However, PixInsight will unpack all packages into the application's root folder. &Acirc;&nbsp;This means we need to embed the "src/scripts/" path as part of the deployment.  We also want to include a build number as part of the filename so each build is unique.  Windows users should substitute appropriate DOS commands. We'll take advantage of the automatic BUILD_NUMBER variable that Jenkins sets as part of the environment for each build.</p>
<pre name="code" class="cpp">
rm -rf *.tar.gz<br />
mkdir src<br />
mkdir src/scripts<br />
cp MyScript.js ./src/scripts<br />
tar -cvzf MyScript-$BUILD_NUMBER.tar.gz src<br />
rm -rf src<br />
</pre><br />
PixInsight uses a file called "updates.xri" to describe the available updates.  This example assumes that there is only one package to update so we'll build the file using a simple template file and substitutions with sed.</p>
<p>We need to create an XML file called "updates.xri.template" and add it to revision control.  This will be the template for the updates.xri file we upload to the server.</p>
<pre name="code" class="xml">
<!--?xml version="1.0" encoding="UTF-8"?--></p>
<p>Updates for the MyScript script for PixInsight</p>
<p>This update installs an update to the MyScript script.</p>
<p>http://www.cerebiggum.com</p>
<p>Copyright (c) 2010 Sean Houghton. All Rights Reserved.</p>
<p></pre><br />
Now, back to the build server.  We can use sed to replace the TEMPLATE values in the XML file with live values using a new Jenkins action.  We'll grab the date with the 'date' command and combine openssl's sha1 feature with sed to produce a signature for the compressed package file.</p>
<pre name="code" class="cpp">
RELEASE_DATE=`date +"%Y%m%d"`<br />
SHA1=`openssl dgst -sha1 MyScript-$BUILD_NUMBER.tar.gz | sed -e "s/^SHA1.*=//" | sed -e "s/[ ]\(.*\)/\1/"`<br />
cat updates.xri.template | sed "s/TEMPLATE_FILENAME/MyScript-$BUILD_NUMBER.tar.gz/" | sed "s/TEMPLATE_RELEASE_DATE/$RELEASE_DATE/" | sed "s/TEMPLATE_SHA1/$SHA1/" > updates.xri<br />
</pre><br />
Finally, the job will upload the update to the web server with the FTP Uploader plugin.</p>
<p>[caption id="attachment_680" align="aligncenter" width="536" caption="Fig 6.  Upload the package to the web server"]<a href="{{site.url_root}}/assets/data/wp/wp/2010/12/FtpUpload.png"><img class="size-full wp-image-680" title="FtpUpload" src="{{site.url_root}}/assets/data/wp/wp/2010/12/FtpUpload.png" alt="" width="536" height="264" /></a>[/caption]</p>
<h3>Done</h3><br />
Now every time you push your changes to GitHub the build server will automatically generate an update package and make it available to everyone.</p>
<p>[caption id="attachment_683" align="aligncenter" width="540" caption="Fig. 6  An update is available"]<a href="{{site.url_root}}/assets/data/wp/wp/2010/12/UpdateAvailable.png"><img class="size-full wp-image-683" title="UpdateAvailable" src="{{site.url_root}}/assets/data/wp/wp/2010/12/UpdateAvailable.png" alt="" width="540" height="166" /></a>[/caption]</p>
<h3>Troubleshooting</h3><br />
When setting up the build jobs you inevitably run in to syntax errors and logic mistakes.  The best tool is the "Console Output" view of each build.  With this tool you can watch the job execute and look for error messages.  I usually get everything working in a shell window before copying it in to a shell action.</p>
<h3>More Complex Configurations</h3><br />
I'll cover a more complex example in a future post that covers building binary PCL modules on different platforms, running automated tests, and aggregating the artifacts into a single update package.</p>
<h3>Cloud/Hosted Services</h3></p>
<p>All of the services mentioned can be run on your own personal hardware. &Acirc;&nbsp;However, it can be very convenient to use a hosted service. &Acirc;&nbsp;This makes configuration easy, you usually get free disaster recovery, and it's&Acirc;&nbsp;accessible&Acirc;&nbsp;anywhere.</p>
<ul>
<li>GitHub is an excellent source code repository hosting service. &Acirc;&nbsp;It has very nice features that promote contributions and a tiered pricing scheme that starts with a free account.</li>
<li>CloudBees is a new service that will host an instance of Jenkins for you. &Acirc;&nbsp;You can then run a build nodes on your home machine, your work machine, your friend's machine, etc. &Acirc;&nbsp;It's a very convenient way to manage building binaries for multiple platforms.</li><br />
</ul></p>
