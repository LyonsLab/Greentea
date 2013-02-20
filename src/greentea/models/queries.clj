(ns greentea.models.queries
  (:use [korma.core]
        [greentea.db]))

(defn coge-log-user-data []
  "This is to test json output from the coge db"
  (select log
    (fields :user_id)
    (group :user_id)))

(defn coge-log-comment-data []
  "This is to test json output from the coge db"
  (select log
    (fields :comment)
    (where
      (not= :comment "nil"))))

(defn coge-log-all-data []
  "Returns all log data from the CoGe database"
  (select log
    (group :link)
    (where
      (> :time 0))))

(defn jobs-data [type]
  "Returns all data from the CoGe database useful
  for representing unique jobs ran over time."
  (select log
    (fields :time)
    (where
      (and
        (> :time "0")
        (cond (nil? type)
          (or (like :page "GeVo%")
              (like :page "SynMap%")
              (like :page "SynFind%")
              (like :page "CoGeBlast%"))
          :else (like :page (str type "%")))))))

(defn user-account-creation-data [type]
  "Returns all data from the CoGe database useful
  for representing user account creation over time."
  (select log
    (fields :time)
    (order :time)
    (where
      (and
        (> :time 0)
        (cond (nil? type)
          (= :description "create user")
          :else (= :description "create user group"))))))

(defn coge-page-types [type]
  "Returns all distinct page types from the log table in the coge database."
  (select log
    (modifier "distinct")
    (order :page)
    (fields :page)
    (where
      (and
        (> :time 0)
        (cond (nil? type)
          (like :page "%")
          :else (like :page (str type "%")))))))
