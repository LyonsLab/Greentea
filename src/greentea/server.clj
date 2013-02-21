(ns greentea.server
  (:gen-class)
  (:use [greentea.config]
        [greentea.db])
  (:require [noir.server :as server]))

(server/load-views-ns 'greentea.views)

(defn -main [& m]
  (db-config)
  (let [mode (keyword (or (first m) :dev))
        port (read-string jettyport)]
    (server/start port {:mode mode
                        :ns 'greentea})))

