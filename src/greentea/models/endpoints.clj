(ns greentea.models.endpoints
  (:require [noir.response :as nr]
            [greentea.models.queries :as cq]
            [greentea.models.mutators :as mu])
  (:use [noir.core]))

(defpage "/coge-log-user" []
  (nr/json (cq/coge-log-user-data)))

(defpage "/coge-log-comment" []
  (nr/json (cq/coge-log-comment-data)))

(defpage "/coge-log-all" []
  (nr/json (cq/coge-log-all-data)))

(defpage "/coge-log-timeseries" []
  (nr/json (cq/coge-log-timeseries-data)))

(defpage "/coge-log-jobs-day" []
  (nr/json (mu/group-jobs-by-day)))
