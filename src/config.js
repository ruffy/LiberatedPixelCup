goog.provide('lpc.Config');

goog.require('goog.math.Size');

//tamanho da célula
lpc.Config.GRID_CELL = 32;

//tamanho da tela em células
lpc.Config.GRID = new goog.math.Size(25, 20);

//tamanho da tela em pixels
lpc.Config.SCREEN = new goog.math.Size(lpc.Config.GRID.width * lpc.Config.GRID_CELL, lpc.Config.GRID.height * lpc.Config.GRID_CELL);