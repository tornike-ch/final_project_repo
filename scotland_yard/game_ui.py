import pygame
import json
from classes import MrX, Detective, Detective_Tickets, MrX_Tickets

pygame.init()

# ეკრანის ზომების განსაზღვრა
infoObject = pygame.display.Info()
WIDTH, HEIGHT = infoObject.current_w, infoObject.current_h
screen = pygame.display.set_mode((WIDTH, HEIGHT), pygame.FULLSCREEN | pygame.RESIZABLE)
pygame.display.set_caption("Scotland-Yard Game")

# კონსტანტები
GRID_WIDTH, GRID_HEIGHT = 2500, 2000
MIN_ZOOM, MAX_ZOOM = 0.5, 5.0
SILVER = (220, 220, 220)
WHITE, BLACK, RED, GREEN, BLUE, YELLOW = (255, 255, 255), (40, 40, 40), (220, 60, 60), (60, 220, 60), (60, 60, 220), (220, 220, 60)
GRAY = (128, 128, 128)
NODE_INNER = (250, 250, 250)
NODE_BORDER = (100, 100, 100)

# რუკის მორგება ეკრანის ზომებზე
def update_scaling():
    global scale_factor, offset_x, offset_y, MIN_ZOOM, MAX_ZOOM
    padding = 0.1
    width_scale = WIDTH * (1 - padding) / GRID_WIDTH
    height_scale = HEIGHT * (1 - padding) / GRID_HEIGHT
    MIN_ZOOM = min(width_scale, height_scale)
    MAX_ZOOM = MIN_ZOOM * 5.0
    scale_factor = MIN_ZOOM
    offset_x = (WIDTH - GRID_WIDTH * scale_factor) / 2
    offset_y = (HEIGHT - GRID_HEIGHT * scale_factor) / 2

def handle_resize(width, height):
    global WIDTH, HEIGHT
    WIDTH, HEIGHT = width, height
    update_scaling()
    global offset_x, offset_y
    offset_x = (WIDTH - GRID_WIDTH * scale_factor) / 2
    offset_y = (HEIGHT - GRID_HEIGHT * scale_factor) / 2

update_scaling()

def clamp(value, min_value, max_value):
    return max(min_value, min(value, max_value))


try:
    with open("scotland_yard/maps.json", "r") as file:
        game_map = json.load(file)
except FileNotFoundError:
    print("Error: Cannot find maps.json file")
    exit(1)

# კვანძების დახატვის ფუნქცია

def draw_node(node, font, highlight=False, highlight_color=GREEN):
    x = int(node.get("position", {}).get("x", 0) * scale_factor + offset_x)
    y = int(node.get("position", {}).get("y", 0) * scale_factor + offset_y)
    
    color = highlight_color if highlight else NODE_INNER
    pygame.draw.circle(screen, color, (x, y), 15)
    pygame.draw.circle(screen, NODE_BORDER, (x, y), 15, 2)

    if any(edge["type"] == "bus" for edge in node.get("edges", [])):
        pygame.draw.circle(screen, BLUE, (x, y), 22, 2)
    if any(edge["type"] == "underground" for edge in node.get("edges", [])):
        pygame.draw.circle(screen, RED, (x, y), 27, 2)

    text = font.render(str(node["id"]), True, BLACK)
    text_rect = text.get_rect(center=(x, y))

    shadow_text = font.render(str(node["id"]), True, GRAY)
    shadow_rect = shadow_text.get_rect(center=(x + 1, y + 1))
    screen.blit(shadow_text, shadow_rect)
    screen.blit(text, text_rect)

# კავშირების დახატვის ფუნქცია

def draw_edges(node, nodes_dict, edge_type):
    x1, y1 = int(node["position"]["x"] * scale_factor + offset_x), int(node["position"]["y"] * scale_factor + offset_y)
    for edge in node.get("edges", []):
        if edge["type"] != edge_type:
            continue
            
        to_node = nodes_dict.get(edge["to"])
        if not to_node:
            continue

        x2, y2 = int(to_node["position"]["x"] * scale_factor + offset_x), int(to_node["position"]["y"] * scale_factor + offset_y)
        
        if edge_type == "underground":
            width = 6
            color = RED
        elif edge_type == "bus":
            width = 4
            color = BLUE
        else:
            width = 2
            color = BLACK

        pygame.draw.line(screen, color, (x1, y1), (x2, y2), width)

# მოთამაშეების დახატვის ფუნქცია

def draw_player(player, nodes_dict, color, index=None):
    node = nodes_dict.get(player.current_location())
    if node:
        x = int(node["position"]["x"] * scale_factor + offset_x)
        y = int(node["position"]["y"] * scale_factor + offset_y)
        
        pygame.draw.circle(screen, color, (x, y), 17)
        pygame.draw.circle(screen, BLACK, (x, y), 17, 2)
        
        label = "M" if isinstance(player, MrX) else f"D{index}"
        font = pygame.font.Font(None, 28)
        text = font.render(label, True, WHITE)
        text_rect = text.get_rect(center=(x, y))
        screen.blit(text, text_rect)

# მოთამაშეების ადგილმდებარეობები

def get_player_at_position(players, nodes_dict, pos):
    for player in players:
        node = nodes_dict.get(player.current_location())
        if node:
            x = int(node["position"]["x"] * scale_factor + offset_x)
            y = int(node["position"]["y"] * scale_factor + offset_y)
            if (x - pos[0]) ** 2 + (y - pos[1]) ** 2 <= 15 ** 2:
                return player
    return None

# კვანძების ადგილმდებარეობები

def get_node_at_position(nodes, pos):
    for node in nodes:
        x = int(node.get("position", {}).get("x", 0) * scale_factor + offset_x)
        y = int(node.get("position", {}).get("y", 0) * scale_factor + offset_y)
        if (x - pos[0]) ** 2 + (y - pos[1]) ** 2 <= 13 ** 2:
            return node
    return None

# თამაშის დასრულების ვიზუალი

def show_game_over_popup(message):
    popup_width, popup_height = 300, 150
    popup_x = (WIDTH - popup_width) // 2
    popup_y = (HEIGHT - popup_height) // 2
    
    pygame.draw.rect(screen, WHITE, (popup_x, popup_y, popup_width, popup_height))
    pygame.draw.rect(screen, BLACK, (popup_x, popup_y, popup_width, popup_height), 2)
    
    font = pygame.font.Font(None, 36)
    text = font.render("Game Over!", True, BLACK)
    message_text = font.render(message, True, BLACK)
    
    text_rect = text.get_rect(center=(WIDTH // 2, popup_y + 40))
    message_rect = message_text.get_rect(center=(WIDTH // 2, popup_y + 80))
    
    screen.blit(text, text_rect)
    screen.blit(message_text, message_rect)
    pygame.display.flip()
    
    waiting = True
    while waiting:
        for event in pygame.event.get():
            if event.type in (pygame.MOUSEBUTTONDOWN, pygame.KEYDOWN, pygame.QUIT):
                waiting = False
                return

# გამოჭერის შემოწმება

def check_collision(mrx, detectives):
    for detective in detectives:
        if detective.current_node == mrx.current_node:
            show_game_over_popup("Detectives Win!")
            return True
    return False

# ბილეთების ვიზუალი

def draw_ticket_info(player, font, position=(10, 50)):
    info_x, info_y = position
    bg_padding = 10

    if isinstance(player, MrX):
        tickets = [f"Black: {player.tickets.black}", f"Double: {player.tickets.double}"]
        color = RED
    else:
        tickets = [
            f"Taxi: {player.tickets.taxi}",
            f"Bus: {player.tickets.bus}", 
            f"Underground: {player.tickets.underground}"
        ]
        color = BLUE

    max_width = max(font.size(text)[0] for text in tickets) + 2 * bg_padding
    total_height = len(tickets) * 25 + bg_padding
    pygame.draw.rect(screen, WHITE, (info_x - bg_padding, info_y - bg_padding, 
                                   max_width, total_height))
    pygame.draw.rect(screen, color, (info_x - bg_padding, info_y - bg_padding, 
                                   max_width, total_height), 2)

    for i, text in enumerate(tickets):
        ticket_text = font.render(text, True, BLACK)
        screen.blit(ticket_text, (info_x, info_y + i * 25))

# ბილეთების ლოგი

def draw_all_tickets(players, font, current_player):

    draw_ticket_info(current_player, font, (10, 50))

    y_offset = 150
    for i, player in enumerate(players):
        if player != current_player:
            if isinstance(player, MrX):
                tickets_text = f"MrX - B:{player.tickets.black} D:{player.tickets.double}"
            else:
                tickets_text = f"D{i} - T:{player.tickets.taxi} B:{player.tickets.bus} U:{player.tickets.underground}"
            text = font.render(tickets_text, True, BLACK)
            pygame.draw.rect(screen, WHITE, (5, y_offset, text.get_width() + 10, 25))
            screen.blit(text, (10, y_offset))
            y_offset += 30

# სვლების ვიზუალი

def move_player(player, node, detectives, nodes_dict, use_black_ticket=False, use_double_ticket=False, double_ticket_first_move=False):
    if not isinstance(player, MrX):
        transport_type = player.get_valid_moves()[node["id"]]
        player.move_to_node(node["id"])
        player.use_ticket(transport_type)
        return transport_type, False
    
    if use_double_ticket:
        if double_ticket_first_move:
            player.use_ticket("double")
            return handle_double_ticket_move(player, node, detectives, nodes_dict, first_move=True)
        else:
            return handle_double_ticket_move(player, node, detectives, nodes_dict, first_move=False)
    elif use_black_ticket:
        player.move_to_node(node["id"], detectives)
        player.use_ticket("black")
        return "black", False
    else:
        transport_type = player.get_valid_moves()[node["id"]]
        player.move_to_node(node["id"], detectives)
        player.use_ticket(transport_type)
        collision = any(detective.current_node == node["id"] for detective in detectives)
        return transport_type, collision

# მისტერ X-ის სვლების ისტორია
def draw_mrx_history(transport_history, font, position=None):
    if position is None:
        padding = 20
        info_x = WIDTH - 250
        info_y = 100
    else:
        info_x, info_y = position
    
    bg_padding = 10

    title = "MrX Transport History:"
    title_text = font.render(title, True, BLACK)

    history_texts = []
    for i, transport in enumerate(transport_history, 1):
        history_texts.append(f"Round {i}: {transport.upper()}")

    max_width = max(
        max((font.size(text)[0] for text in history_texts), default=0),
        font.size(title)[0]
    ) + 2 * bg_padding

    if info_x + max_width > WIDTH - 10:
        info_x = WIDTH - max_width - 10
    
    total_height = (len(history_texts) + 1) * 25 + bg_padding

    background_surface = pygame.Surface((max_width + 2 * bg_padding, total_height + 2 * bg_padding))
    background_surface.fill(WHITE)
    background_surface.set_alpha(240)
    screen.blit(background_surface, (info_x - bg_padding, info_y - bg_padding))

    pygame.draw.rect(screen, RED, 
                    (info_x - bg_padding, info_y - bg_padding, 
                     max_width + 2 * bg_padding, total_height + 2 * bg_padding), 2)

    screen.blit(title_text, (info_x, info_y))

    for i, text in enumerate(history_texts):
        history_text = font.render(text, True, BLACK)
        screen.blit(history_text, (info_x, info_y + (i + 1) * 25))

# შავი ბილეთის პოპაპი

def show_black_ticket_popup():
    popup_width, popup_height = 300, 150
    popup_x = (WIDTH - popup_width) // 2
    popup_y = (HEIGHT - popup_height) // 2

    pygame.draw.rect(screen, WHITE, (popup_x, popup_y, popup_width, popup_height))
    pygame.draw.rect(screen, BLACK, (popup_x, popup_y, popup_width, popup_height), 2)

    font = pygame.font.Font(None, 36)
    text = font.render("Use Black Ticket?", True, BLACK)
    yes_text = font.render("Yes", True, BLACK)
    no_text = font.render("No", True, BLACK)
    
    text_rect = text.get_rect(center=(WIDTH // 2, popup_y + 40))
    yes_rect = yes_text.get_rect(center=(WIDTH // 2 - 50, popup_y + 100))
    no_rect = no_text.get_rect(center=(WIDTH // 2 + 50, popup_y + 100))
    
    screen.blit(text, text_rect)
    screen.blit(yes_text, yes_rect)
    screen.blit(no_text, no_rect)
    pygame.display.flip()

    waiting = True
    while waiting:
        for event in pygame.event.get():
            if event.type == pygame.MOUSEBUTTONDOWN:
                if yes_rect.collidepoint(event.pos):
                    return True
                elif no_rect.collidepoint(event.pos):
                    return False
            elif event.type in (pygame.KEYDOWN, pygame.QUIT):
                waiting = False
                return False

# ორმაგი ბილეთის პოპაპი

def show_double_ticket_popup():
    popup_width, popup_height = 300, 150
    popup_x = (WIDTH - popup_width) // 2
    popup_y = (HEIGHT - popup_height) // 2

    pygame.draw.rect(screen, WHITE, (popup_x, popup_y, popup_width, popup_height))
    pygame.draw.rect(screen, BLACK, (popup_x, popup_y, popup_width, popup_height), 2)

    font = pygame.font.Font(None, 36)
    text = font.render("Use Double Ticket?", True, BLACK)
    yes_text = font.render("Yes", True, BLACK)
    no_text = font.render("No", True, BLACK)
    
    text_rect = text.get_rect(center=(WIDTH // 2, popup_y + 40))
    yes_rect = yes_text.get_rect(center=(WIDTH // 2 - 50, popup_y + 100))
    no_rect = no_text.get_rect(center=(WIDTH // 2 + 50, popup_y + 100))
    
    screen.blit(text, text_rect)
    screen.blit(yes_text, yes_rect)
    screen.blit(no_text, no_rect)
    pygame.display.flip()

    waiting = True
    while waiting:
        for event in pygame.event.get():
            if event.type == pygame.MOUSEBUTTONDOWN:
                if yes_rect.collidepoint(event.pos):
                    return True
                elif no_rect.collidepoint(event.pos):
                    return False
            elif event.type in (pygame.KEYDOWN, pygame.QUIT):
                waiting = False
                return False

# ორმაგი ბილეთის გამოყენება

def handle_double_ticket_move(player, node, detectives, nodes_dict, first_move=True):
    use_black = False
    if player.tickets.black > 0:
        use_black = show_black_ticket_popup()
    
    transport_type = player.get_valid_moves()[node["id"]]
    
    if use_black:
        player.move_to_node(node["id"], detectives)
        player.use_ticket("black")
        return "black", False
    else:
        player.move_to_node(node["id"], detectives)
        player.use_ticket(transport_type)
        collision = any(detective.current_node == node["id"] for detective in detectives)
        return transport_type, collision