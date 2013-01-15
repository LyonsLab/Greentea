(ns greentea.models.mutators
  (:require [greentea.models.helpers :as hl]
            [greentea.models.queries :as cq]))

(defn group-jobs-by-day
  "Takes in timeseries data and groups it by days." []
  (hl/format-data-for-graph (into (sorted-map)
    (reduce #(assoc %1 %2 (inc (%1 %2 0))) {}
      (hl/mold-timeseries-data-to-days (cq/jobs-data))))))




