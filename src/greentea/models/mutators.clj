(ns greentea.models.mutators
  (:require [greentea.models.helpers :as hl]
            [greentea.models.queries :as cq]))

(defn group-jobs-by-day
  "Takes unix-epoch timeseries data, groups it by day and count, and formats it
   into easily workable json."
  [type]
  (hl/format-data-for-graph (sort
    (frequencies (hl/mold-timeseries-data-to-epoch (cq/jobs-data type))))))

(defn accumulate-jobs-by-day
  "Takes unix-epoch timeseries data, groups it by day and count, plus the
   previous count, and formats it into easily workable json."
  [type]
    (let [data (hl/mold-timeseries-data-to-epoch (cq/jobs-data type))]
      (hl/accumulate-and-format-data data)))

(defn accumulate-account-creations
  "Preprocesses the account creation data accumulated to be returned as JSON"
  [type]
    (let [data (hl/mold-timeseries-data-to-epoch
           (cq/user-account-creation-data type))]
      (hl/accumulate-and-format-data data)))

(defn day-account-creations
  "Preprocesses the account creation-data by day ready to be returned as JSON"
  [type]
    (let [data (hl/mold-timeseries-data-to-epoch
           (cq/user-account-creation-data type))]
      (hl/format-data-for-graph (sort (frequencies data)))))

