from random import choice
import json

try:
    with open("scotland_yard/maps.json", "r") as file:
        map = json.load(file)
except FileNotFoundError:
    print("Error: Cannot find maps.json file")
    exit(1)

start, end = 1, 199
exclude = {35, 45, 51, 71, 78, 104, 106, 127, 132, 146, 166, 170, 172}

class Player:
    def __init__(self, role, current_node, tickets):
        self.role = role
        self.current_node = current_node
        self.tickets = tickets
        self.edges = []
        if current_node:
            self.update_edges()

    def update_edges(self):
        for node in map['nodes']:
            if node['id'] == self.current_node:
                self.edges = node['edges']
                break

    def move(self, new_node):
        self.current_node = new_node
        self.update_edges()
        return True

    def use_ticket(self, transport_type):
        if hasattr(self.tickets, transport_type):
            current_value = getattr(self.tickets, transport_type)
            if current_value > 0:
                setattr(self.tickets, transport_type, current_value - 1)
                return True
        return False

    def find_possible_nodes(self):
        return {edge['to']: edge['type'] for edge in self.edges}

    def current_location(self):
        return self.current_node

    def move_to_node(self, new_node):
        valid_moves = self.find_possible_nodes()
        if new_node in valid_moves:
            transport_type = valid_moves[new_node]
            if self.move(new_node):
                self.use_ticket(transport_type)
                return transport_type
        return None

    def show_tickets(self):
        return f"{self.role} has {self.tickets} tickets left"

    def __str__(self):
        return f"{self.role} is at node {self.current_node} with tickets {self.tickets}"

class MrX(Player):
    @classmethod
    def create(cls, tickets):
        valid_locations = set(range(start, end + 1)) - exclude
        spawn_location = choice(list(valid_locations))
        return cls(spawn_location, tickets)

    def __init__(self, current_node, tickets):
        super().__init__("Mr. X", current_node, tickets)
        self.hidden = True

    def reveal(self):
        self.hidden = False
        print(f"MrX is at node {self.current_node}")

    def hide(self):
        self.hidden = True
        print("MrX location is hidden.")

    def get_valid_moves(self):
        return self.find_possible_nodes()

    def move_to_node(self, new_node, detectives):
        valid_moves = self.find_possible_nodes()
        while new_node not in valid_moves:
            new_node = int(input(f"Invalid move. Enter a valid node to move to from {list(valid_moves.keys())}: "))
        if self.move(new_node):
            transport_type = valid_moves[new_node]
            self.use_ticket(transport_type)
            for detective in detectives:
                if self.current_node == detective.current_node:
                    print("MrX has been caught by a detective! Detectives win!")
                    exit(0)

class Detective(Player):
    def __init__(self, current_node, tickets):
        super().__init__("Detective", current_node, tickets)
        self.all_detectives = set()
    
    def spawn(self, start, end, exclude, used_locations):
        valid_locations = set(range(start, end + 1)) - exclude - used_locations
        if not valid_locations:
            raise ValueError("No available locations to spawn detectives.")
        self.current_node = choice(list(valid_locations))
        used_locations.add(self.current_node)
        self.update_edges()
        self.all_detectives = used_locations
        return self.current_node

    def get_valid_moves(self):
        possible_moves = self.find_possible_nodes()
        valid_moves = {}
        for node, transport in possible_moves.items():
            has_ticket = getattr(self.tickets, transport, 0) > 0
            if node not in self.all_detectives and has_ticket:
                valid_moves[node] = transport
        return valid_moves

    def move(self, new_node):
        self.all_detectives.remove(self.current_node)
        super().move(new_node)
        self.all_detectives.add(new_node)

    def move_to_node(self, new_node):
        valid_moves = self.get_valid_moves()
        while new_node not in valid_moves or new_node in self.all_detectives:
            new_node = int(input(f"Invalid move. Enter a valid node to move to from {list(valid_moves.keys())} that is not occupied by another detective: "))
        if self.move(new_node):
            transport_type = valid_moves[new_node]
            self.use_ticket(transport_type)
            print(f"{self.role} moved to node {new_node} using {transport_type}")

    def has_valid_moves(self):
        return bool(self.get_valid_moves())

class Detective_Tickets:
    def __init__(self, taxi=11, bus=8, underground=5):
        self.taxi = taxi
        self.bus = bus
        self.underground = underground

    def __getitem__(self, item):
        return getattr(self, item)

    def __str__(self):
        return f"Taxi: {self.taxi}, Bus: {self.bus}, Underground: {self.underground}"

class MrX_Tickets:
    def __init__(self, black=5, double=2):
        self.black = black
        self.double = double

    def __str__(self):
        return f"Black: {self.black}, Double: {self.double}"

