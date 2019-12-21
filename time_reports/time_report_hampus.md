# TimeReports
| Date  |      Hours    | Activity                                       |
| ----------- | ------- |------------------------------------------------|
| 2019-11-04  | 1       | Setup Github Repository and first time reporting. |
| 2019-11-04  | 1       | Research on nodeJS and MongoDB. |
| 2019-11-04  | 1       | Research on Web Development. |
| 2019-11-05  | 1       | Setup issues and project on Github and coming up with an initial architecture of the system. |
| 2019-11-05  | 4       | Started to build the RESTful API (model, controller, routes). Also created a first simulator of wind speed and household electric consumption. |
| 2019-11-05  | 1       | Updated time report to appropriate model. |
| 2019-11-12  | 2       | Work progress with simulator and for wind, demand and price. Basically trying to build a model by hand before implementing. |
| 2019-11-13  | 4       | Further work with api for gathering specific data to server from mongodb. |
| 2019-11-14  | 1       | Updated simulator for households consumptions. |
| 2019-11-14  | 3       | Work progress for API for specific prosumer to update its consumption in DB. |
| 2019-11-14  | 1       | Watched tutorials on how to apply microservices in order to keep the architecture clean. |
| 2019-11-15  | 1       | Refactored the project and split up server to one separate module for the simulator. |
| 2019-11-18  | 5       | Introduced current price to the simulator based on the last wind and demand, had some problems on how to run it asynchronously based on the last wind and demand but it worked out in the end. |
| 2019-11-20  | 9       | Added helper files for connections to different databases. Updated models for prosumer and its API. |
| 2019-11-21  | 1       | Progress on production simulator, problems remains within the different connections. |
| 2019-11-26  | 4       | Finished production simulator, started to look at how tokens can be used in order to secure each API call. |
| 2019-11-27  | 6       | Improvements on wind, consumer consumption, price and prosumer simulator. Introduced buffer simulator and introduced over_production_sell and under_production_buy to model. |
| 2019-12-02  | 7       | Introduced balance and updated buffer simulator with selling and buying variables. | 
| 2019-12-03  | 3       | Been testing different approaches of showing charts on dashboard. |
| 2019-12-04  | 6       | Work progress on prosumer dashboard. Built a model for the dashboard which also provides values from the API . |
| 2019-12-05  | 7       | Prosumer dashboard update: sliders that provides functionality to update sell and buy ratio. Did some debugging aswell. |
| 2019-12-09  | 5       | Improvements to simulator. Fixed bugs in buffer (selling and buying). |
| 2019-12-10  | 3       | Initialized a manager user and simulator for coal power plant. |
| 2019-12-11  | 5       | Bugfixes on buffer simulator and made prosumers and managers into one model (user) with an extra field that indicates if manager or not. Some refactoring of the code. |
| 2019-12-12  | 4       | Progress on manager website, introduced prosumer list. |
| 2019-12-15  | 3       | Finished a model of the manager website frontend. |
| 2019-12-16  | 4       | Some changes to the manager dashboard and bugfixes of simulator buffer. |
| 2019-12-18  | 4       | Set up issues for manager website backend. Finished the demand section of the manager dashboard backend. Also solved a small bug. |
| 2019-12-19  | 3       | Fixed some conflicts and started on the price panel of manager dashboard. |
| 2019-12-21  | 2       | Finished the price panel of manager dashboard. (Set new market price and earnings) |
