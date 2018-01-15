angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {


  })

  .controller('MarketlistsCtrl',
    function ($scope, $timeout, apiService) {
      $scope.previousAmount = 32000;

      $scope.market = "XVG/BTC";
      $scope.currency1 = "BTC";
      $scope.currency2 = "XVG";

      function getCurrentAmount() {
        async.parallel({
          balance: apiService.balance,
          marketsData: apiService.getLastMarketData,
          // koinex: apiService.getKoinex
        }, function (err, data) {
          $scope.oldBalance = data.balance.old;
          $scope.newBalance = data.balance.new;

          $scope.newBinance = _.find($scope.newBalance, function (n) {
            return n.market == "Binance";
          });

          $scope.market1Data = {};
          $scope.market1Data.bitcoin = parseFloat($scope.newBinance.data.BTC.available) + parseFloat($scope.newBinance.data.BTC.onOrder);
          $scope.market1Data.other = parseFloat($scope.newBinance.data.XVG.available) + parseFloat($scope.newBinance.data.XVG.onOrder);


          $scope.newHitbtc = _.find($scope.newBalance, function (n) {
            return n.market == "Hitbtc";
          });

          $scope.market2Data = {};
          $scope.market2Data.bitcoin = parseFloat($scope.newHitbtc.data.BTC.cash);
          $scope.market2Data.other = parseFloat($scope.newHitbtc.data.XVG.cash);


          $scope.totalBitcoin = parseFloat($scope.newBinance.data.BTC.available) + parseFloat($scope.newHitbtc.data.BTC.cash);
          $scope.totalVerge = parseFloat($scope.newBinance.data.XVG.available) + parseFloat($scope.newHitbtc.data.XVG.cash);
          $scope.vergeBitCoinPrice = parseFloat(data.marketsData[0].data.XVGBTC.bid);
          $scope.vergeBitcoinValue = $scope.totalVerge * $scope.vergeBitCoinPrice;

          $scope.totalBitcoinValue = $scope.totalBitcoin + $scope.vergeBitcoinValue;
          if (data.koinex && data.koinex.prices) {
            $scope.bitcoinToInr = parseFloat(data.koinex.prices.BTC);
          } else {
            $scope.bitcoinToInr = 1020000;
          }
          $scope.currentValue = _.floor($scope.totalBitcoinValue * $scope.bitcoinToInr) + 20000;
          $scope.growth = ($scope.currentValue / $scope.previousAmount - 1) * 100;
        });
      }
      getCurrentAmount();

      function getArbitrage() {
        apiService.getArbitrage(function (err, data) {
          $scope.arbitrage = data;
        });
      }
      getArbitrage();



      io.socket.on("RatioBuySell", function (data) {
        $scope.ratioBuySell = data;
        $scope.$apply();
      });

      io.socket.on("RatioSellBuy", function (data) {
        $scope.ratioSellBuy = data;
        $scope.$apply();
      });

      io.socket.on("Arbitrage", function (data) {
        $scope.arbitrageData = data;
        $scope.$apply();
      });

    })

  .controller('MarketlistCtrl', function ($scope, $stateParams) {});
