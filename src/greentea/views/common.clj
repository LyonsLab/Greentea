(ns greentea.views.common
  (:use [noir.core :only [defpartial]]
        [hiccup.page]
        [hiccup.element]))

(defpartial global [title]
  [:head
    [:title (str "CoGe Analytics - " title)]
    (include-css
      "/css/reset.css"
      "/css/style.css")
    (include-js
      "//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"
      "//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js")])

(defpartial graph-nav []
  [:div#graph-nav
    [:span.nav]
    [:a#day.nav {:href "/graph/day"} [:li.nav "Day"]]
    [:span.nav]
    [:a#month.nav {:href "/graph/month"} [:li.nav "Month"]]
    [:span.nav]])

(defpartial navbar []
  [:div#navbar
    [:span.nav]
    [:a#info.nav {:href "/info"} [:li.nav "Info"]]
    [:span.nav]
    [:a#apps.nav {:href "/apps"} [:li.nav "Apps"]]
    [:span.nav]
    [:a#components.nav {:href "/components"} [:li.nav "Components"]]
    [:span.nav]
    [:a#integrators.nav {:href "/integrators"} [:li.nav "Integrators"]]
    [:span.nav]
    [:a#graphs.nav {:href "/graph"} [:li.nav "Graphs"]]
    [:span.nav]])

(defpartial wrapper [& content]
  [:div#wrapper
    (image {:id "logo" :alt "CoGe Logo"} "/img/logo.png")
    [:br]
    content]
  [:br])

(defpartial footer []
  [:div#footer])

(defpartial page [& content]
  (navbar)
  (wrapper content)
  (footer))

(defpartial graph-page [& content]
  (html5
    [:head
      (global "Graph - by Day")
      (include-js "/js/lib/spin.min.js"
                  "/js/spinner.js")
      (javascript-tag "$(document).ready(function(){
                       $('#graphs').addClass('active');});")]
    [:body
      {:onload "createChart()"}
      (page
        [:h3
          [:select#type.selector {:onchange "reloadChart()"}
            [:option  {:data ""} "All"]
            [:option {:data "Completed"} "Completed"]
            [:option {:data "Failed"} "Failed"]]
        "CoGe Apps Over Time"]
        [:br] (graph-nav) [:br]
        [:div#chart]
        [:div#loader]
        content
        [:h5.right "Data Starting from: " [:span#firstDate]])
      (include-js "/js/lib/amcharts.js"
                  "/js/lib/underscore-min.js")]))

(defpartial day-page []
  (include-js "/js/day-graph.js")
  (javascript-tag "$('#day').addClass('active')"))

(defpartial month-page []
  (include-js "/js/month-graph.js")
  (javascript-tag "$('#month').addClass('active')"))

(defpartial raw-page [& content]
  (html5
    [:head
      (global "Raw Data")]
    [:body
      (page content)]))
