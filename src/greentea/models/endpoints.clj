(ns greentea.models.endpoints
  (:require [noir.response :as nr]
            [greentea.models.queries :as cq])
  (:use [noir.core]))

(defpage "/coge-log-user-list" []
  (nr/json (cq/coge-log-user-data)))

(defpage "/coge-log-comment-data" []
  (nr/json (cq/coge-log-comment-data)))

(defpage "/coge-log-all-data" []
  (nr/json (cq/coge-log-all-data)))

(defpage "/coge-log-timeseries-data" []
  (nr/json (cq/coge-log-timeseries-data)))
