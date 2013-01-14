(ns greentea.models.helpers
  (:require [clj-time.format :as format]
            [clj-time.coerce :as coerce]))

(defn get-valid-epoch
  "Returns a valid epoch timestamp."
  [date]
  ;(try (coerce/to-long (format/parse old-osm-format date))
  ;  (catch IllegalArgumentException e
  ;    (try (coerce/to-long (format/parse old-osm-format-2 date))
  ;      (catch IllegalArgumentException e
  (Long/to-long date))
  ;))))

(defn format-data-for-graph
  "This function takes in dates and their counts and parses them into a JSON
  object for easy graph data parsing in javascript."
[data]
(map
#(hash-map
      :date (key %)
      :count (val %))
    data))

