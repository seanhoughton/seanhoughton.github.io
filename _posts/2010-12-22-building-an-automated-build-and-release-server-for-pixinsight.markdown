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
alias: /2010/12/building-an-automated-build-and-release-server-for-pixinsight/index.html
---
PixInsight 1.6.9 introduced a new automated update system - a system that allows developers to easily deploy updates as soon as they are ready. Automated deployment can bebothamazingly convenient for your users and a complete nightmare for the developer. Without proper automation accidents will happen and user experience will suffer. This post details a method for automating the deployment of your software in an effort to minimize defective releases. The example content is a simple PJSR script, but the described method applies to PCL modules.

### Raw materials.

- Web server with a domain name and FTP access. I use [DreamHost.com](http://dreamhost.com), use my promo code <code>PIXINSIGHT</code> for a discount.
- Revision control server. I use [GitHub](http://github.com)
- Jenkins (previously known as Hudson) continuous integration server [Jenkins](http://jenkins-ci.org)
- OpenSSL command line tools [OpenSSL](http://www.openssl.org)
- Java runtime [JRE](http://www.java.com/en/download)

### Setting Up The Build Server

Jenkins is a continuous integration server. A continuous integration server can do many things for you but it's main purpose is to automatically pull the most recent version of code from a repository any time it changes and perform some type of operation on it. Most CI servers provide additional functionality for managing build artifacts and Jenkins is no exception. We're going to use Jenkins to bundle up our script in the required format and upload the result to our web server.

After downloading Jenkins you need to start it on the command line:

{% highlight bash %}
java -jar jenkins.war
{% endhighlight %}

Jenkins is now running and you can configure a new job using a web browser.  The default Jenkins instance can be accessed at <a href="http://localhost:8080" target="_blank">http://localhost:8080</a>

We'll be using the FTP Upload plugin in our job so we should install and set it up first.  You can install this from within Jenkins's plugin manager, <em>Manage Jenkins -> Manage Plugins -> Available</em>.  You may need to install a plugin for your revision control provider here too.  Once it's installed you'll need to restart Jenkins.

[caption id="attachment_681" align="aligncenter" width="463" caption="Fig. 1  Installing the FTP Uploader plugin"]<a href="{{site.url_root}}/media/2010/12/FtpPlugin.png"><img class="size-full wp-image-681" title="FtpPlugin" src="{{site.url_root}}/media/2010/12/FtpPlugin.png" alt="" width="463" height="90" /></a>[/caption]

The plugin lets you build a predefined list of servers that each job can use.  We'll set up a connection on the global configuration page, <em>Manage Jenkins -> Configure System</em>.

[caption id="attachment_679" align="aligncenter" width="555" caption="Fig. 2  Setting up an FTP connection"]<a href="{{site.url_root}}/media/2010/12/FtpSetup.png"><img class="size-full wp-image-679" title="FtpSetup" src="{{site.url_root}}/media/2010/12/FtpSetup.png" alt="" width="555" height="260" /></a>[/caption]

### Creating a Build Job
Now we're ready to create our job.  Select "New Job" from the menu.

[caption id="attachment_676" align="aligncenter" width="565" caption="Fig. 3 Creating a new job in Jenkins"]<a href="{{site.url_root}}/media/2010/12/NewJob.png"><img class="size-full wp-image-676" title="NewJob" src="{{site.url_root}}/media/2010/12/NewJob.png" alt="" width="565" height="499" /></a>[/caption]

The job will pull code from our revision control repository.

[caption id="attachment_675" align="aligncenter" width="545" caption="Fig. 4  Configuring a GitHub repository for our job"]<a href="{{site.url_root}}/media/2010/12/GitHub.png"><img class="size-full wp-image-675" title="GitHub" src="{{site.url_root}}/media/2010/12/GitHub.png" alt="" width="545" height="377" /></a>[/caption]

The job should run every time a change is submitted.

[caption id="attachment_682" align="aligncenter" width="541" caption="Fig. 5  Polling the SCM repository"]<a href="{{site.url_root}}/media/2010/12/ScmPolling1.png"><img class="size-full wp-image-682" title="ScmPolling" src="{{site.url_root}}/media/2010/12/ScmPolling1.png" alt="" width="541" height="165" /></a>[/caption]

At this point the job is configured to trigger whenever a code change happens but it doesn't actually do anything with the downloaded code. We need to add some build actions to bundle up the content into a format that is ready to put on the web server and that PixInsight will understand.  In this example we are running Jenkins in OSX so we're using the "Execute Shell" action, Windows users will need to use "Execute Windows Batch Command" instead.

First we need to build a compressed file containing the script. Our plugin was developed without any subdirectories. However, PixInsight will unpack all packages into the application's root folder. This means we need to embed the "src/scripts/" path as part of the deployment.  We also want to include a build number as part of the filename so each build is unique.  Windows users should substitute appropriate DOS commands. We'll take advantage of the automatic BUILD_NUMBER variable that Jenkins sets as part of the environment for each build.

{% highlight cpp %}
rm -rf *.tar.gz
mkdir src
mkdir src/scripts
cp MyScript.js ./src/scripts
tar -cvzf MyScript-$BUILD_NUMBER.tar.gz src
rm -rf src
{% endhighlight %}

PixInsight uses a file called "updates.xri" to describe the available updates.  This example assumes that there is only one package to update so we'll build the file using a simple template file and substitutions with sed.

We need to create an XML file called "updates.xri.template" and add it to revision control.  This will be the template for the updates.xri file we upload to the server.

{% highlight xml %}
<!--?xml version="1.0" encoding="UTF-8"?-->
Updates for the MyScript script for PixInsight
This update installs an update to the MyScript script.
http://www.cerebiggum.com
Copyright (c) 2010 Sean Houghton. All Rights Reserved.
{% endhighlight %}

Now, back to the build server.  We can use sed to replace the TEMPLATE values in the XML file with live values using a new Jenkins action.  We'll grab the date with the 'date' command and combine openssl's sha1 feature with sed to produce a signature for the compressed package file.

{% highlight bash %}
RELEASE_DATE=`date +"%Y%m%d"`<br />
SHA1=`openssl dgst -sha1 MyScript-$BUILD_NUMBER.tar.gz | sed -e "s/^SHA1.*=//" | sed -e "s/[ ]\(.*\)/\1/"`<br />
cat updates.xri.template | sed "s/TEMPLATE_FILENAME/MyScript-$BUILD_NUMBER.tar.gz/" | sed "s/TEMPLATE_RELEASE_DATE/$RELEASE_DATE/" | sed "s/TEMPLATE_SHA1/$SHA1/" > updates.xri<br />
{% endhighlight %}

Finally, the job will upload the update to the web server with the FTP Uploader plugin.

[caption id="attachment_680" align="aligncenter" width="536" caption="Fig 6.  Upload the package to the web server"]<a href="{{site.url_root}}/media/2010/12/FtpUpload.png"><img class="size-full wp-image-680" title="FtpUpload" src="{{site.url_root}}/media/2010/12/FtpUpload.png" alt="" width="536" height="264" /></a>[/caption]

### Done
Now every time you push your changes to GitHub the build server will automatically generate an update package and make it available to everyone.

[caption id="attachment_683" align="aligncenter" width="540" caption="Fig. 6  An update is available"]<a href="{{site.url_root}}/media/2010/12/UpdateAvailable.png"><img class="size-full wp-image-683" title="UpdateAvailable" src="{{site.url_root}}/media/2010/12/UpdateAvailable.png" alt="" width="540" height="166" /></a>[/caption]

### Troubleshooting
When setting up the build jobs you inevitably run in to syntax errors and logic mistakes.  The best tool is the "Console Output" view of each build.  With this tool you can watch the job execute and look for error messages.  I usually get everything working in a shell window before copying it in to a shell action.

### More Complex Configurations
I'll cover a more complex example in a future post that covers building binary PCL modules on different platforms, running automated tests, and aggregating the artifacts into a single update package.

### Cloud/Hosted Services

All of the services mentioned can be run on your own personal hardware. However, it can be very convenient to use a hosted service. This makes configuration easy, you usually get free disaster recovery, and it'saccessibleanywhere.

- GitHub is an excellent source code repository hosting service. It has very nice features that promote contributions and a tiered pricing scheme that starts with a free account.
- CloudBees is a new service that will host an instance of Jenkins for you. You can then run a build nodes on your home machine, your work machine, your friend's machine, etc. It's a very convenient way to manage building binaries for multiple platforms.

