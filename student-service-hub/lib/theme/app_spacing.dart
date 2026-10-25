import 'package:flutter/material.dart';

abstract final class AppSpacing {
  static const double page = 20;
  static const double section = 32;
  static const double card = 24;
  static const double compact = 16;
  static const double tight = 8;

  static const EdgeInsets pagePadding = EdgeInsets.symmetric(
    horizontal: page,
    vertical: 24,
  );
  static const EdgeInsets cardPadding = EdgeInsets.all(card);
}
