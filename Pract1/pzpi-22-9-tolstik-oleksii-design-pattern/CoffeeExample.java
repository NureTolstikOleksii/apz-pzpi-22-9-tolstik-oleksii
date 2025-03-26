interface Coffee {
    String getDescription();
    double getCost();
}

class BasicCoffee implements Coffee {
    public String getDescription() {
        return "Кава";
    }

    public double getCost() {
        return 20;
    }
}

class MilkDecorator implements Coffee {
    private Coffee coffee;

    public MilkDecorator(Coffee coffee) {
        this.coffee = coffee;
    }

    public String getDescription() {
        return coffee.getDescription() + " + молоко";
    }

    public double getCost() {
        return coffee.getCost() + 5;
    }
}

public class CoffeeExample {
    public static void main(String[] args) {
        Coffee coffee = new BasicCoffee();
        coffee = new MilkDecorator(coffee);

        System.out.println(coffee.getDescription()); // Кава + молоко
        System.out.println(coffee.getCost());        // 25.0
    }
}
