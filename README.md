CoGe - Greentea
================
CoGe Greentea is a metrics and analytics engine for the CoGe platform written on Clojure's web framework Noir. 

How To: Deploy on a Server via Apache Webserver
-----------------------------------------------

Prerequisites:
--------------
(You can install these CLI tools using your linux distributions preferred package manager) 

* Apache2 - with plugins
 * libapache2-mod-proxy-html - For proxying the running port to the correct endpoints. 
 * libxml2-dev 
* Maven - For Clojure Dependencies 
* Git - For cloning repos in from github 
* [Leiningen] - Automate Clojure projects without setting your hair on fire.
[Leiningen]: https://github.com/technomancy/leiningen 

Configuring Greentea to the Database
-------------------------------------

Once you have all the prerequisites installed, you need to get the Greentea (Analytics) repo from Github. Run: 

`$ git clone https://github.com/LyonsLab/Greentea.git`

_TODO: Create a method of loading settings into Analytics from a configuration file so there's no need to unsafely fudge with the code._

* Open "Greentea/src/greentea/db.clj" in your favorite text editor. 

* Modify from line 9: 

        defdb cogedb                                                                   
            (mysql {:db "<DB>;"                                                            
            :user "<DB USER>;"                                                          
            :host "<DB HOST (probably localhost)>"
            :port "<DB&nbsp;PORT (remove this line if default)>"
            :password "<DB PASSWORD>"})

* Write to the file. Make sure not to push any sensitive information back to Github!

Get Greentea Running:
---------------------

* Inside the cloned directory run: 

`$ lein run &`

* This should pull in all the required dependencies and start a Jetty servlet running on port 3456. 

* Check localhost:3456 to verify that the analytics platform is running. 

Configure Apache to Proxy the Servlet Port to the /greentea Endpoint:
----------------------------------------------------------------------

Now to setup apache to point localhost/greentea/ to port 3456.

* Open '/etc/apache2/apache.conf' (or another conf location) in your favorite editor and add these lines: 

        RewriteEngine On 
        NameVirtualHost *:90 
        Listen 90
        
        <VirtualHost *:90> 
          ServerAdmin coge.genome@gmail.com ServerName localhost 
          ErrorLog /home/rchasman/logs/error.log 
          CustomLog <PATH>/logs/access.log combined 
          LogLevel warn
                     
          ProxyPass /analytics/ http://localhost:3456/analytics/                       
          ProxyPass /analytics http://localhost:3456/analytics/    
          
          ProxyPass /greentea/ http://localhost:3456/greentea/                        
          ProxyPass /greentea http://localhost:3456/greentea/                          
        </VirtualHost>

These lines proxy calls to /greentea and /greentea/ to port 3456 so that we don't have to type any ugly numbers to reach our site. 

* Finally, run: 

`sudo services apache2 restart`

If it says OK, it means the server should be started and you should be able to point a browser at it. 

If everything was configured properly point your browser to <DNS>/Greentea and Greentea should be up and running!

----
