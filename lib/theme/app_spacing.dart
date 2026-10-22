import 'package:flutter/material.dart';

abstract final class AppSpacing {
  static const double page = 20;
  static const double section = 24;
  static const double card = 16;
  static const double compact = 12;
  static const double tight = 8;

  static const EdgeInsets pagePadding = EdgeInsets.all(page);
  static const EdgeInsets cardPadding = EdgeInsets.all(card);
}
