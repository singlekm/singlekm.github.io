import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
};

const formatPercentage = (value) => {
  return `${value.toFixed(2)}%`;
};

const IncomeBreakdownSimulator = () => {
  const [scenarios, setScenarios] = useState({});
  const [currentScenario, setCurrentScenario] = useState(null);
  const [yearMonth, setYearMonth] = useState('');

  const [productLines, setProductLines] = useState([
    { id: 1, name: 'Product A', quantity: 100, unitPrice: 50 },
    { id: 2, name: 'Product B', quantity: 75, unitPrice: 75 },
    { id: 3, name: 'Product C', quantity: 50, unitPrice: 100 },
  ]);

  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Cost of Goods Sold', percentage: 30 },
    { id: 2, name: 'Salaries and Wages', percentage: 25 },
    { id: 3, name: 'Rent', percentage: 5 },
    { id: 4, name: 'Utilities', percentage: 2 },
    { id: 5, name: 'Marketing', percentage: 3 },
    { id: 6, name: 'Other Operating Expenses', percentage: 5 },
  ]);

  const calculateRevenue = () => {
    return productLines.reduce((total, product) => total + product.quantity * product.unitPrice, 0);
  };

  const calculateTotalExpensesPercentage = () => {
    return expenses.reduce((total, expense) => total + expense.percentage, 0);
  };

  const calculateNetIncomePercentage = () => {
    return 100 - calculateTotalExpensesPercentage();
  };

  const handleProductChange = (id, field, value) => {
    setProductLines(productLines.map(product => 
      product.id === id ? { ...product, [field]: field === 'name' ? value : Number(value) } : product
    ));
  };

  const handleExpenseChange = (id, field, value) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, [field]: field === 'name' ? value : Number(value) } : expense
    ));
  };

  const addProduct = () => {
    const newId = Math.max(...productLines.map(p => p.id), 0) + 1;
    setProductLines([...productLines, { id: newId, name: `New Product ${newId}`, quantity: 0, unitPrice: 0 }]);
  };

  const addExpense = () => {
    const newId = Math.max(...expenses.map(e => e.id), 0) + 1;
    setExpenses([...expenses, { id: newId, name: `New Expense ${newId}`, percentage: 0 }]);
  };

  const deleteProduct = (id) => {
    setProductLines(productLines.filter(product => product.id !== id));
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const saveScenario = () => {
    if (yearMonth.match(/^\d{6}$/)) {
      const newScenario = {
        yearMonth,
        productLines: [...productLines],
        expenses: [...expenses],
        revenue: calculateRevenue(),
        totalExpensesPercentage: calculateTotalExpensesPercentage(),
        netIncomePercentage: calculateNetIncomePercentage(),
      };
      setScenarios({...scenarios, [yearMonth]: newScenario});
      setCurrentScenario(yearMonth);
      setYearMonth('');
    } else {
      alert('Please enter a valid YYYYMM format for the year and month.');
    }
  };

  const loadScenario = (scenarioKey) => {
    const scenario = scenarios[scenarioKey];
    setProductLines(scenario.productLines);
    setExpenses(scenario.expenses);
    setCurrentScenario(scenarioKey);
  };

  const revenue = calculateRevenue();
  const totalExpensesPercentage = calculateTotalExpensesPercentage();
  const netIncomePercentage = calculateNetIncomePercentage();

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Multi-scenario Net Income Breakdown Simulator</h1>
      
      <div className="mb-4 flex items-center space-x-2">
        <Input
          placeholder="YYYYMM"
          value={yearMonth}
          onChange={(e) => setYearMonth(e.target.value)}
          className="w-32"
        />
        <Button onClick={saveScenario}><Save className="w-4 h-4 mr-2" /> Save Scenario</Button>
        <Select onValueChange={loadScenario} value={currentScenario || ''}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select scenario" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(scenarios).map((key) => (
              <SelectItem key={key} value={key}>{key}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Product Lines</CardTitle>
            <Button onClick={addProduct} size="sm"><PlusCircle className="w-4 h-4 mr-2" /> Add Product</Button>
          </CardHeader>
          <CardContent>
            {productLines.map((product) => (
              <div key={product.id} className="mb-4 p-4 border rounded">
                <div className="flex justify-between items-center mb-2">
                  <Input
                    value={product.name}
                    onChange={(e) => handleProductChange(product.id, 'name', e.target.value)}
                    className="font-semibold w-3/4"
                  />
                  <Button onClick={() => deleteProduct(product.id)} variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Quantity: {product.quantity}</Label>
                    <Slider
                      min={0}
                      max={1000}
                      step={1}
                      value={[product.quantity]}
                      onValueChange={(value) => handleProductChange(product.id, 'quantity', value[0])}
                    />
                  </div>
                  <div>
                    <Label>Unit Price: {formatCurrency(product.unitPrice)}</Label>
                    <Slider
                      min={0}
                      max={100000}
                      step={100}
                      value={[product.unitPrice]}
                      onValueChange={(value) => handleProductChange(product.id, 'unitPrice', value[0])}
                    />
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Total: {formatCurrency(product.quantity * product.unitPrice)}
                </div>
              </div>
            ))}
            <div className="mt-4 font-semibold">
              Total Revenue: {formatCurrency(revenue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Expenses (% of Revenue)</CardTitle>
            <Button onClick={addExpense} size="sm"><PlusCircle className="w-4 h-4 mr-2" /> Add Expense</Button>
          </CardHeader>
          <CardContent>
            {expenses.map((expense) => (
              <div key={expense.id} className="mb-4 p-4 border rounded">
                <div className="flex justify-between items-center mb-2">
                  <Input
                    value={expense.name}
                    onChange={(e) => handleExpenseChange(expense.id, 'name', e.target.value)}
                    className="font-semibold w-3/4"
                  />
                  <Button onClick={() => deleteExpense(expense.id)} variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Label>Percentage of Revenue: {formatPercentage(expense.percentage)}</Label>
                <Slider
                  min={0}
                  max={100}
                  step={0.1}
                  value={[expense.percentage]}
                  onValueChange={(value) => handleExpenseChange(expense.id, 'percentage', value[0])}
                />
                <div className="mt-2 text-sm text-gray-600">
                  Amount: {formatCurrency(revenue * expense.percentage / 100)}
                </div>
              </div>
            ))}
            <div className="mt-4 font-semibold">
              Total Expenses: {formatPercentage(totalExpensesPercentage)} ({formatCurrency(revenue * totalExpensesPercentage / 100)})
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Revenue</h3>
              <p>{formatCurrency(revenue)}</p>
            </div>
            <div>
              <h3 className="font-semibold">Total Expenses</h3>
              <p>{formatPercentage(totalExpensesPercentage)} ({formatCurrency(revenue * totalExpensesPercentage / 100)})</p>
            </div>
            <div className="col-span-2">
              <h3 className="font-semibold">Net Income</h3>
              <p className={netIncomePercentage >= 0 ? 'text-green-600' : 'text-red-600'}>
                {formatPercentage(netIncomePercentage)} ({formatCurrency(revenue * netIncomePercentage / 100)})
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncomeBreakdownSimulator;
