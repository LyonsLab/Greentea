(ns greentea.config
  (:use [clojure.string :only (blank? split)])
  (:require [clojure-commons.props :as cc-props]
            [clojure.tools.logging :as log]))

(def props
  "The properites that have been loaded from Zookeeper."
  (atom nil))

(def required-props
  "The list of required properties."
  (ref []))

(def configuration-is-valid
  "True if the configuration is valid."
  (atom true))

(defn- record-missing-prop
  "Records a property that is missing.  Instead of failing on the first
   missing parameter, we log the missing parameter, mark the configuration
   as invalid and keep going so that we can log as many configuration errors
   as possible in one run."
  [prop-name]
  (log/error "required configuration setting" prop-name "is empty or"
             "undefined")
  (reset! configuration-is-valid false))

(defn- record-invalid-prop
  "Records a property that is invalid.  Instead of failing on the first
   invalid parameter, we log the parameter name, mark the configuraiton as
   invalid and keep going so that we can log as many configuration errors as
   possible in one run."
  [prop-name t]
  (log/error "invalid configuration setting for" prop-name ":" t)
  (reset! configuration-is-valid false))

(defn- get-str
  "Gets a string property from the properties that were loaded from
   Zookeeper."
  [prop-name]
  (let [value (get @props prop-name)]
    (log/trace prop-name "=" value)
    (when (blank? value)
      (record-missing-prop prop-name))
    value))

(defn- get-int
  "Gets an integer property from the properties that were loaded from
   Zookeeper."
  [prop-name]
  (try
    (Integer/valueOf (get-str prop-name))
    (catch NumberFormatException e
      (do (record-invalid-prop prop-name e) 0))))

(defmacro defprop
  "Defines a property."
  [sym docstr & init-forms]
  `(def ~(with-meta sym {:doc docstr}) (memoize (fn [] ~@init-forms))))

(defn- required
  "Registers a property in the list of required properties."
  [prop]
  (dosync (alter required-props conj prop)))

;'Metadactyl' Postgres connection properties
(required
  (defprop mysqldb-driver
    "The database driver."
    (get-str "greentea.mysqldb.driver")))

(required
  (defprop mysqldb-subprotocol
    "The database subprotocol."
    (get-str "greentea.mysqldb.subprotocol")))

(required
  (defprop mysqldb-host
    "the host name or IP address used to connect to the database."
    (get-str "greentea.mysqldb.host")))

(required
  (defprop mysqldb-port
    "The port used to connect to the database."
    (get-int "greentea.mysqldb.port")))

(required
  (defprop mysqldb-database
    "The name of the database."
    (get-str "greentea.mysqldb.database")))

(required
  (defprop mysqldb-user
    "The database username."
    (get-str "greentea.mysqldb.user")))

(required
  (defprop mysqldb-password
    "The database password."
    (get-str "greentea.mysqldb.password")))

(required
  (defprop listen-port
    "The port to listen to for incoming connections."
    (get-int "greentea.app.listen-port")))

(defn configuration-valid
  "Ensures that all required properties are valued."
  []
  (dorun (map #(%) @required-props))
  @configuration-is-valid)

(defn log-config
  "Logs all of the configuration values at a log level of WARN. Excludes database password from the
   log output."
  [props]
  (let [not-password? #(not= (first %1) "greentea.mysqldb.password")]
    (doseq [prop-pair (filter not-password? (seq props))]
      (log/warn (first prop-pair) " = " (last prop-pair)))))
