
00:00
Yeah, perfect. So to introduce myself, my name is Robin. I'm in third year at HIG in media engineering and I'm doing my bachelor thesis at Antistatique, the web agency in Lausanne. And the main focus of my job is to find a solution to  standardize the image management, the image delivery and the optimization to make it less coupled to the framework or technology that is used. So first I'm doing now a benchmark and I will try to implement the solution in the next week. So I found the service that you made, so Roca,And I had some questions about it. First of all, maybe, why did you choose to make it an intern solution rather than use a software as a service or another solution from the market that was already existing? 

01:33
Good question. I mean, that was maybe 10 years ago or more when we started and we worked for Migros back then and we worked for Freitag the bag company from Zurich. So, and they both had millions of pictures or images and they, I think Mikro sponsored it even a little bit. So, and everything else we looked at, I mean, back then there was still, what is it, Cloud, not Cloud. Cloudinary. Yeah. Those are the big, that's the big one. Today, they don't have, didn't have some features we wanted, like I think the storage stuff or they have but it also I guess it's not cheap pretend we do it now. Migros is still using it. Also the Swiss television is using it at least the German part but I think also the French part. Yeah lots of those luxury watches which our office in Lausanne the websites for.

02:45
So it was a client's need that gave you the idea to build this?

2:50
Yeah, if I remember correctly, I wasn't in that team back then, but yes, Migros had a need. We could convince them that we should build it for them, and then they allowed us to use the code and make our own service for that. Okay.

03:10
So today, what would you make, what would you make decide rather to choose a SaaS image than a ROCA or rather to choose ROCA than a SAS image? What's the main advantage that you find in ROCA that you can't find somewhere else?

03:30
I didn't look much at the competition in the last few years. I mean, basically,
So the good thing for our, I mean it's mostly used for our client projects. As I said, we have some external clients like the television and Migros is not working much else for Migros. I mean, since we have the code and we can do whatever you want, why not use it and sell the service to our clients? Make money. Some money. I think we wouldn't build it today. But it has this super special feature that if you upload an image, you get a hashback and then you can be sure to reuse that image and if you upload the same again then it will get you back the same hash and I think not many have that feature it's usually the file name which can get complicated so

04:45
okay okay so for example if you if you name the the if you name two different pictures with the same name you get the same hash back ?

04:56
Yes, I mean, if it's the same binary, then you get the same hashback. I think it's SHA, SHA-SHA something, something from the binary. So, yeah. So, yeah, it was important to us to be able to do that and then to be able to store millions of pictures without performance downgrades. And then, of course, to deliver them as fast as possible and optimize. I think that the huge optimization or the time intensive operations we do right now on the optimization, I think we only added that later. So because we do, we compressed the image in different quality settings and then we check is it still good or not and that can take
several seconds per image. 

05:32
Do you do this on the fly or do you do this on the upload of the image and then store multiple versions of it?

05:47
We do it on the fly, not the heavy optimization. If you want a certain size for the first time that we do on the fly, because that's usually cheap, and then in the background we optimize it later. So the second or third time you come, when you come later, then you will have the more optimized image. So now, I mean, we don't do pre-rendered app because you have many, many sizes nowadays per image. And also, we also, for example, check if it would be better in WebP or in JPEG, Excel or in AFIF. Yes. JPEG or JPEG even, but every browser nowadays supports at least WebP. But we check the header, what does the browser support and then decide what to send. So yes, we added all these features during the years, but to make it better and faster.

07:21
Okay, and if you had to design it again today, what would you do differently? Would you focus on more maybe the features you added recently or would you take a different approach? Do you think there's something, some mistakes were made and you would don't do them again?

07:50
Obviously, you made some mistakes. Maybe it's not such a big deal. I mean, it's written in, but that's not the issue. It's written in PHP because we had lots of PHP developers 10 years ago. And I just, I mean, I like the language. I still like it. I just don't do much anymore in PHP anymore.But on the other hand, it's not the limiting factor. So performance wise, because the image transformation is the big part and that's of course not written in PHP. It's using other libraries. Now, the guy who did the foundation with these hashes and with using DynamoDB, it runs on Amazon. It's scalable like. We don't have to care about scalability. I mean, we have to start servers and take them down or scale it, but the database is just, we don't care. It just works. Which makes it a little bit complicated, but I wouldn't change that. Maybe, so we didn't invest that much in further developing it the last few years because the problem is solved. It stores images and resizes them. It's not...What could you add? I mean, we added little features here and there. So that's also the reason why it still runs on Amazon. And back then there was no Swiss Amazon data center. And moving that would now be a really huge effort. It's in Germany, at least in Europe, which is sometimes important to our clients. Big mistakes. Now, as I said, the foundation was very well thought and we took it from there. And the only thing is we can't move away from Amazon. Because DynamoDB and S3, there are alternatives to DynamoDB. We would need to have rewrite the whole database layer. But doable. I mean, nowadays, even easier. Just tell the agent to do it.

10:01
Yeah, but is it worth it in terms of time, money and so on? If it's not, then no. No, no, no. 

10:23
It's just if someone wants to give us lots of money because he wants to self-host that somewhere.

10:41
And how did you choose the library of the resizing image? What was the main criteria that made you choose one already existing? Because I think there you choose an already existing library to resize the image for libvps, for example, or something else. What made you choose one from another and how did you handle this decision?

11:11
performance. That was the reason. I mean we started with the usual suspect, it's ImageMagick which can do everything and in every format and which works fine but that was really slow and used lots of memory for bigger pictures so I looked around and then I saw libwips or vips. And it was, I think, four times as fast or something like that than ImageMagick. And also because the guy who writes or wrote it, that was really important to him. So he took a different approach. So it depends on the operation you do, but they don't need to read the whole image into memory and streams more or less. Yeah. So that was the main reason.I mean it can't do everything ImageMagick can do but the guy is really responsive on GitHub so when we had a problem he answered and or even added stuff and I helped him with the PHP extension for it or help testing and yes that was really cool or is still cool but and for some exotic formats, we fall back to ImageMagick or Libvips even have an ImageMagick layer. So it only supports the most common formats, but if you need to read whatever, then it uses the ImageMagick reader and writer. So the switch was not that difficult to do. But yeah, it was performance. That was the main reason.

13:11
Another question about reversibility. If a client today leaves or wants to migrate away from Rokka, has this case ever happened? How would you handle it? 

13:29
Everything is API controlled. So there's an API and you can just download all of the images and metadata through the API, which if you have three terabytes of images. It can take some time and also cost us egress money. But yeah, I said we worked for Freitag, but they switched in the provider and they just wanted all their images back and just dumped the S3 on a hard drive and gave it to them. They didn't even want to have the metadata, like the names or whatever. They just, yeah. It's good. We just want it on the hard drive in case we're looking for an image somewhere. But yes, it's totally API driven. If you have a few hundred thousand images, you write the script and download everything.

14:28
But the part where the client has to integrate the SDKs you made, they have to rewrite it all on their own. Is this anyway managed or planned or just it's not my client anymore, we don't care and they do what they have to do?

14:48
Yes. I mean, sometimes we're using Drupal a lot, CMS and we wrote the rocker plugin for Drupal. I guess if you just remove that, it will serve the images from Drupal's own storage.

15:13
Ah, okay. Yeah, I see. I see. So, your...fallback mechanism not made by you but somehow the CMS still manages to serve an image heavy and not optimized but to serve something rather than just a blank rectangle yeah 

15:31
yes I don't know exactly how it works in drupal or that would be a way or you just if you want to switch to cloudinary then you add the cloudinary plugin and hope for the best. Now, I mean, the images are maybe not in Drupal, but nowadays, I mean, that's also the good thing about the service like Rokka, that because you usually deploy to Kubernetes or whatever, and you don't have permanent storage or just expensive ones when you have the images. So you have your database, of course, you need that for CMS, but the images are just sent to Rokka. You don't have to care about storage on your device,server. So in that case, of course, you have to download them again and store somewhere else. But yeah, it's really more a question of what your CMS or website can handle or how you implement it. Usually you also have a thin layer so that you say, I want an image this size, I want this image in this size, and then the library you can switch out if you want.But it's not something we provide. Here's the library. 


16:48
And for an agency like Antistatique, with many different stacks and environments like Liip has, what would your main advice be when choosing an image architecture? What's the trap? What not to fall in? Else than just use Rokka and give up.

17:20
It's always the same if you use SaaS, which Rokka also is, then you're totally dependent on them money-wise. So what if they increase their prices? What if they think, "Oh no, we don't want to do it again." What if your client thinks, "No, please no US companies," whatever. Or if you're stuck and they don't want to help because you're just a small fish or whatever. Yeah, I mean, we had all of that with cloud solutions. It's always you're totally independent if it's an important part of your project, which images usually are, at least for websites. And then

18:17
But you never know. Or they just decide, okay, we need to double the prices because we have now AI features. 

18:33
Smart cropping with AI or something. 

18:42
Yeah. The other thing is certainly what you asked first, how can we move away from them in case we don't want them anymore? As I said, I mean, good for us that Migros also has 3-4 terabytes of images. And they use it in lots of places, so switching for them would be painful.

20:12
My next question is, do you know any public documentation or technical reference that you would find interesting to cite in the work that I will be making? Like always in software engineering, it's such a compromise of different factors and many different things. But do you know any scientific literature about something like this? Or what you base your decision in Rokka for Rokka on, rather than just performance?

20:55
I started 30 years ago, so I'm not sure I read ever a scientific paper again since then. No, sorry, nothing comes to mind. 

21:32

No worries. Okay, I think it's all the questions that I had. Yes, do you have any other questions or anything else that you would say you would find interesting for me to know? 

21:45
I mean, one thing, I'm not sure if the problem with, I mean, of course, if people use something, a raw cloud, it costs them money. And it can get expensive because traffic is not cheap usually for this kind of things. And one important thing is usually, do the people or the clients think it's really worth it to gain those 10, 20, 30% of image size or the bytes that it is fast? I mean, that's the reasonable price expectation because, I mean, let's take the Drupal example, for example, they also can resize images locally and with image matching, not just, I mean, slow and whatever, but good enough. And with something like Rocca or Cloudinary, you can save maybe 20% or 30%. That's a very rough figure. So is it really worth to spend several hundred francs per month for just a random website. Yes. I mean, of course, it's important for Migros and Swiss television that it's fast and it needs to be fast also. But that's usually the feedback I get. So, yeah, do we need that? Okay. Because everyone has a gigabit line at home or the phone also is fast enough to, yeah. so that's something so something um is it worth it and for me i mean the speed it was worth it but it's also we don't have to care about three terabytes of storage we can outsource that and hope they do backups

23:27
so it's it's it's pretty relevant for like very big businesses but maybe under like ten thousands of image for a website it's not so relevant to use such a solution? 

23:59
No, and I mean we use it in our Drupal projects, we use it by default. Okay. But otherwise, if it's a smaller, I mean then it's maybe 50 bucks per month or something like that. But for the developers, it's also easy, they just click the button, install a Rokka plugin, and then they don't have to care that the correct binaries are installed on the server, about the performance, just click the button and everything is taken care of. So if you as an agency, if you have this solution or some plugins, they're just, okay, I just need to install it or that I know how it works. It's worth developer time, which is also not cheap.

24:50
Yes, so it enhances developer experience to have something simple and standardized through all the project on the same.

24:59
They just don't have to care about image sizing and whatever. It's just the plugin does it or Rokka does it and when they have the problem or a question they come to the Rokka people and ask why is it like that can we do that so yes it's this um something which was annoying before and now it's just do this and 

25:27
you said you use it by default on drupal uh projects but on other projects, why wouldn't you use it by default? Is it because the connectors don't exist or just the people don't find it relevant to use it? 

25:49
Both. Okay. No, the problem is because there's hacks to circumvent it, but because if you upload it, you get the hash and you need that hash in the URL to get that image back. which makes it sometimes complicated because you need to know the hash of that image. So you need to store it somewhere in the DB and it's not just like, here's the image. But it's also a question of not used to or some developers never used it and didn't see the point of it. And yes, of course, if you have some custom development project, then Yeah, you need to integrate it somehow. It's not just crack and drop. And then yes, I know Cloudinary certainly has tons of plugins, hundreds of plugins. We don't. Yeah, because it's not your main work. 

27:14
Well, Christian, thank you very much for your words, for your information. It was really helpful to me. 

27:42
Happy to hear. And I wish you good luck with your thesis.

27:51
Thank you, Christian. Have a good day. Bye-bye.

(Transcribed by UniScribe (https://www.uniscribe.co). Upgrade to remove this message.)
