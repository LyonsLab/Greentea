(ns greentea.models.mutators
  (:require [greentea.models.helpers :as hl]
            [greentea.models.queries :as cq]))

(defn group-jobs-by-day
  "Takes unix-epoch timeseries data, groups it by day and count, and formats it
   into easily workable json."
  [type]
  (hl/format-data-for-graph (sort
    (frequencies (hl/mold-timeseries-data-to-days (cq/jobs-data type))))))

(defn accumulate-jobs-by-day
  "Takes unix-epoch timeseries data, groups it by day and count, plus the
   previous count, and formats it into easily workable json."
  [type]
    (let [data (hl/mold-timeseries-data-to-days (cq/jobs-data type))]
      (let [vals (hl/accumulate (vals (frequencies data)))
            keys (sort (keys (frequencies data)))]
        (map #(hash-map :date (key %)
                        :count (val %))
          (sort (zipmap keys vals))))))

(defn account-creations
  "preprocesses the account creation-data ready to be returned as JSON"
  [type]
  (hl/format-data-for-graph (sort
    (frequencies (hl/mold-timeseries-data-to-epoch
      (cq/user-account-creation-data type))))))

