(ns greentea.models.mutators
  (:require [greentea.models.queries :as cq]
            [greentea.models.helpers :as hl]
            [clj-time.format :as format]
            [clj-time.coerce :as coerce]))

(defn group-jobs-by-day
  "Takes in timeseries data and groups it by days." []
  (into (sorted-map) (reduce #(assoc %1 %2 (inc (%1 %2 0))) {}
    (map
      #(* 86400000 (long (/ (hl/get-valid-epoch (str %)) 86400000)))
        (cq/coge-log-timeseries-data)))))



