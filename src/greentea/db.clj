(ns greentea.db
    (:use [greentea.config]
          [korma.db]
          [korma.core]))

(defdb cogedb
  (mysql {:db dbname
          :user dbuser
          :host dbhost
          :port dbport
          :password dbpass}))

(defentity log
  (pk :log_id)
  (table :log)
  (database cogedb)
  (entity-fields :log_id :time
                 :user_id :page
                 :description :link
                 :status :comment))

(defn korma-define
  "Defines a korma representation of the database using the settings passed in from zookeeper."
  []
  (create-db cogedb)
  (default-connection cogedb))

(defn db-config
  "Sets up a connection to the database using config data loaded from zookeeper into Monger and Korma."
  []
  (korma-define))
