(ns greentea.server
  (:gen-class)
  (:use [greentea.config]
        [greentea.db])
  (:require [noir.server :as server]))

(server/load-views-ns 'greentea.views)

(defn -main [& m]
  (db-config)
  (let [mode (keyword (or (first m) :dev))
        port (int 3456)]
    (server/start port {:mode mode
                        :ns 'greentea})))

