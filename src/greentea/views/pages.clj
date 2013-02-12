(ns greentea.views.pages
  (:require [greentea.views.common :as template]
            [noir.response :as nr]
            [clojure.string :as string]
            [greentea.models.queries :as cq])
  (:use [noir.core]
        [greentea.db]
        [greentea.models.endpoints]
        [hiccup.element]))

(defpage "/" []
  (render "/graph/day"))

(defpage "/graph/day" []
  (template/graph-page
    (template/day-page)))

(defpage "/graph/accumulated" []
  (template/graph-page
    (template/accumulated-page)))
