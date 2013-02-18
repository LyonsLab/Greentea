(ns greentea.models.helpers
  (:require [clj-time.format :as format]
            [clj-time.core :as time]
            [clj-time.coerce :as coerce]))

(defn mold-timeseries-data-to-epoch
  "Changes timestamp data to epoch timestamp"
  [data]
  (map #(.substring (str (second (first %))) 0 10) data))

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

(defn accumulate-and-format-data [data]
  "Accumulated passed data and formats it for JSON parsing"
  (let [vals (accumulate (vals (frequencies data)))
        keys (sort (keys (frequencies data)))]
    (format-data-for-graph
      (sort (zipmap keys vals)))))
