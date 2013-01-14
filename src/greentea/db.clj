(ns greentea.db
    (:use [greentea.config]
          [korma.db]
          [korma.core]
          [clojure.java.io :only [file]])
    (:require [clojure.tools.logging :as log]
              [clojure-commons.props :as cp]))

(defdb cogedb
  (mysql {:db "coge"
          :user "root"
          :host "localhost"
          :password "root"}))

(defentity log
  (pk :log_id)
  (table :log)
  (database cogedb)
  (entity-fields :log_id :time
                 :user_id :page
                 :description :link
                 :status :comment))

(defn load-configuration-from-props
  "Loads the configuration from the local properties file."
  [passed-filename]
  (reset! props (cp/read-properties
    (file "resources/conf/test/" passed-filename)))

  (log/warn "Configuration Data from local properties file:")
  (log-config @props)

  (when-not (configuration-valid)
    (log/warn "THE CONFIGURATION IS INVALID - EXITING NOW")
    (System/exit 1)))


(defn korma-define
  "Defines a korma representation of the database using the settings passed in from zookeeper."
  []
  (create-db cogedb)
  (default-connection cogedb))

(defn db-config
  "Sets up a connection to the database using config data loaded from zookeeper into Monger and Korma."
  []
  ;(load-configuration-from-props "devs.properties")
  (korma-define))
