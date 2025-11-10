import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:familyaccounting/app.dart';

void main() {
  testWidgets('App loads smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: FamilyAccountingApp()));
    await tester.pumpAndSettle();
    
    expect(find.text('歡迎回來'), findsOneWidget);
  });
}
