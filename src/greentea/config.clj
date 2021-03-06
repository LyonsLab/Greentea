(ns greentea.config
  (:use [clojure.string :only (split)]
        [protoflex.parse]))

(declare detect-sep csv-1)

(defn csv
  "Reads and returns one or more records as a vector of vector of field-values"
  ([] (csv (no-trim #(detect-sep))))
  ([sep] (multi* (fn [] (no-trim-nl #(csv-1 sep))))))

(defn csv-1
  "Reads and returns the fields of one record (line)"
  [sep] (sep-by #(any-string sep) #(chr sep)))

(defonce config
  (reduce conj
    (map #(hash-map (keyword (first %)) (second %))
      (map #(split % #"\s+")
        (filter (comp not nil?)
          (map #(first %)
            (parse #(csv \,)
              (slurp "/opt/apache2/coge/coge.conf"))))))))

(def dbname (:DBNAME config))
(def dbuser (:DBUSER config))
(def dbpass (:DBPASS config))
(def dbhost (:DBHOST config))
(def dbport (:DBPORT config))

(defn get-port []
  (cond (nil? (:ANALYTICS_PORT config))
    3456
  :else
    (read-string (:ANALYTICS_PORT config))))

