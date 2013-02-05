(ns greentea.models.helpers
  (:require [clj-time.format :as format]
            [clj-time.core :as time]
            [clj-time.coerce :as coerce]))

(defn get-valid-epoch
  "Returns a valid epoch timestamp."
  [date]
  ;(try (coerce/to-long (format/parse old-osm-format date))
  ;  (catch IllegalArgumentException e
  ;    (try (coerce/to-long (format/parse old-osm-format-2 date))
  ;      (catch IllegalArgumentException e
  (.getTime date))
  ;))))

(defn mold-timeseries-data-to-epoch
  "Changes timestamp data to epoch timestamp"
  [data]
  (map #(get-valid-epoch (second (first %))) (identity data)))

(defn mold-timeseries-data-to-days
  "Rounds off milliseconds per entry to the epoch time of the start of it's
  day"
  [data]
  (map
    #(* 86400000 (long (/ (get-valid-epoch (second (first %))) 86400000)))
    (identity data)))

(defn format-data-for-graph
  "This function takes in dates and their counts and parses them into a JSON
  object for easy graph data parsing in javascript."
  [data]
  (map
  #(hash-map
        :date (key %)
        :count (val %))
     data))

(defn accumulate
"Takes a list of numbers and returns a list of numbers cummulatively added to
 their previous value"
  [n]
  (loop [oldlist n newlist []]
    (if (empty? oldlist)
      newlist
      (recur
        (rest oldlist)
        (merge newlist
          (if (empty? newlist)
              (first oldlist)
              (+ (first oldlist)
                 (last newlist))))))))
