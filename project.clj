(defproject greentea "0.1.0-SNAPSHOT"
    :description "CoGe's metric and analytics front-end for its backend data"
    :dependencies [[org.clojure/clojure "1.4.0"]
                   [org.iplantc/clojure-commons "1.1.0-SNAPSHOT"]
                   [cheshire "5.0.1"]
                   [clj-time "0.4.4"]
                   [org.clojure/data.json "0.2.0"]
                   [korma/korma "0.3.0-beta10"]
                   [log4j/log4j "1.2.16"]
                   [mysql/mysql-connector-java "5.1.6"]
                   [noir "1.3.0-beta10"]]
    :profiles {:dev {:resource-paths ["resources/conf/test"]}}
    :aot [greentea.server]
    :main greentea.server
)
