goog.provide('lpc.Config');

goog.require('goog.math.Size');

//tamanho da célula
lpc.Config.GRID_CELL = 32;

//tamanho da tela em células
lpc.Config.GRID = new goog.math.Size(15, 13);

//tamanho da tela em pixels
lpc.Config.SCREEN = new goog.math.Size(15 * lpc.Config.GRID_CELL, 13 * lpc.Config.GRID_CELL);