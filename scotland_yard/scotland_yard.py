import pygame
import json
from game_ui import *
from classes import MrX, Detective, Detective_Tickets, MrX_Tickets

def main():
    global offset_x, offset_y, WIDTH, HEIGHT
    running = True
    dragging = False
    drag_start_x, drag_start_y = 0, 0
    needs_redraw = True
    selected_player = None
    highlighted_nodes = []
    use_black_ticket = False
    use_double_ticket = False
    double_ticket_first_move = False

    font = pygame.font.Font(None, 24)
    clock = pygame.time.Clock()

    nodes = map if isinstance(game_map, list) else game_map.get("nodes", [])
    nodes_dict = {node["id"]: node for node in nodes}

    # დეტექტივების და მისტერ X-ის საწყისი ლოკაციები
    start, end = 1, 199
    exclude = {35, 45, 51, 71, 78, 104, 106, 127, 132, 146, 166, 170, 172}
    used_locations = set()

    mrx = MrX.create(MrX_Tickets())
    mrx_spawn_location = mrx.current_location()
    
    detectives = [Detective(None, Detective_Tickets()) for _ in range(4)]
    for detective in detectives:
        detective.spawn(start, end, exclude, used_locations)

    players = [mrx] + detectives

    rounds = 0
    current_turn = 0
    total_players = len(players)
    reveal_rounds = {3, 8, 13, 18, 24}

    # ტრანსპორტის ისტორიის შენახვა
    mrx_transport_history = []
    
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    pygame.display.set_mode((1400, 800), pygame.RESIZABLE)
                    handle_resize(1400, 800)
                    needs_redraw = True
                elif event.key == pygame.K_f:
                    if screen.get_flags() & pygame.FULLSCREEN:
                        pygame.display.set_mode((1400, 800), pygame.RESIZABLE)
                        handle_resize(1400, 800)
                    else:
                        pygame.display.set_mode((infoObject.current_w, infoObject.current_h), 
                                              pygame.FULLSCREEN | pygame.RESIZABLE)
                        handle_resize(infoObject.current_w, infoObject.current_h)
                    needs_redraw = True
            elif event.type == pygame.VIDEORESIZE:
                if not (screen.get_flags() & pygame.FULLSCREEN):
                    handle_resize(event.w, event.h)
                    needs_redraw = True
            elif event.type == pygame.MOUSEBUTTONDOWN:
                if event.button == 1:  # მარცხენა კლიკი
                    current_player = players[current_turn]
                    clicked_player = get_player_at_position(players, nodes_dict, event.pos)
                    if clicked_player == current_player:
                        selected_player = clicked_player
                        highlighted_nodes = clicked_player.get_valid_moves().keys()
                        needs_redraw = True
                    else:
                        dragging = True
                        drag_start_x, drag_start_y = event.pos
                elif event.button == 3:  # მარჯვენა კლიკი
                    current_player = players[current_turn]
                    clicked_player = get_player_at_position(players, nodes_dict, event.pos)
                    
                    if clicked_player == current_player and isinstance(clicked_player, MrX):
                        use_black_ticket = False
                        use_double_ticket = False
                        
                        # ორმაგი და შავი ბილეთის გამოყენება
                        if clicked_player.tickets.double > 0:
                            use_double_ticket = show_double_ticket_popup()

                        if not use_double_ticket and clicked_player.tickets.black > 0:
                            use_black_ticket = show_black_ticket_popup()
                            
                        if use_black_ticket or use_double_ticket:
                            selected_player = clicked_player
                            highlighted_nodes = clicked_player.get_valid_moves().keys()
                            needs_redraw = True

                    else:
                        node = get_node_at_position(nodes, event.pos)
                        if node and selected_player and node["id"] in highlighted_nodes:
                            transport_type, collision = move_player(
                                selected_player, node, detectives, nodes_dict,
                                use_black_ticket, use_double_ticket, double_ticket_first_move
                            )
                            
                            if isinstance(selected_player, MrX):
                                if use_double_ticket:
                                    if double_ticket_first_move:
                                        mrx_transport_history.append(f"DOUBLE: {transport_type}")
                                        double_ticket_first_move = False
                                    else:
                                        mrx_transport_history.append(transport_type)
                                        double_ticket_first_move = True
                                else:
                                    mrx_transport_history.append(transport_type)
                            
                            if collision:
                                show_game_over_popup("Detectives Win!")
                                running = False
                                break
                            
                            if use_double_ticket and double_ticket_first_move:
                                highlighted_nodes = selected_player.get_valid_moves().keys()
                            else:
                                selected_player = None
                                highlighted_nodes = []
                                current_turn = (current_turn + 1) % total_players
                                if current_turn == 0:
                                    rounds += 1
                                    double_ticket_first_move = False
                            
                            needs_redraw = True

            elif event.type == pygame.MOUSEBUTTONUP:
                if event.button == 1:
                    dragging = False

            elif event.type == pygame.MOUSEMOTION:
                if dragging:
                    dx, dy = event.pos[0] - drag_start_x, event.pos[1] - drag_start_y
                    offset_x = clamp(offset_x + dx, -(GRID_WIDTH * scale_factor), WIDTH)
                    offset_y = clamp(offset_y + dy, -(GRID_HEIGHT * scale_factor), HEIGHT)
                    drag_start_x, drag_start_y = event.pos
                    needs_redraw = True

        if needs_redraw:
            screen.fill(SILVER)
            
            # ეკრანის ზომის განსაზღვრა
            current_width, current_height = screen.get_size()

            # კვანძებს შორის კავშირების დახატვა
            for node in nodes:
                draw_edges(node, nodes_dict, "underground")
            for node in nodes:
                draw_edges(node, nodes_dict, "bus")
            for node in nodes:
                draw_edges(node, nodes_dict, "taxi")

            # კვანძების დახატვა
            for node in nodes:
                is_mrx_move = selected_player and isinstance(selected_player, MrX)
                is_detective_move = selected_player and isinstance(selected_player, Detective)
                
                if is_mrx_move:
                    highlight_color = YELLOW
                elif is_detective_move:
                    highlight_color = GREEN
                else:
                    highlight_color = BLACK
                    
                draw_node(node, font, 
                         highlight=node["id"] in highlighted_nodes,
                         highlight_color=highlight_color)

            # მოთამაშეების დახატვა
            if rounds == 0 or rounds in reveal_rounds:
                draw_player(mrx, nodes_dict, YELLOW if rounds == 0 else RED)
            for i, detective in enumerate(detectives, 1):
                draw_player(detective, nodes_dict, BLUE, i)

            current_player = players[current_turn]
            if isinstance(current_player, MrX):
                text = "MrX's turn"
                color = RED
            else:
                detective_number = current_turn
                text = f"Detective {detective_number}'s turn"
                color = BLUE
            
            # სვლის ინდიკატორი
            font = pygame.font.Font(None, 32)
            turn_text = font.render(text, True, color)
            pygame.draw.rect(screen, WHITE, (5, 5, turn_text.get_width() + 20, 30))
            pygame.draw.rect(screen, BLACK, (5, 5, turn_text.get_width() + 20, 30), 2)
            screen.blit(turn_text, (15, 10))

            # რაუნდის მთვლელი
            round_text = font.render(f"Round: {rounds + 1}", True, BLACK)
            pygame.draw.rect(screen, WHITE, (WIDTH - round_text.get_width() - 25, 5, round_text.get_width() + 20, 30))
            pygame.draw.rect(screen, BLACK, (WIDTH - round_text.get_width() - 25, 5, round_text.get_width() + 20, 30), 2)
            screen.blit(round_text, (WIDTH - round_text.get_width() - 15, 10))

            # ბილეთების მთვლელი
            draw_all_tickets(players, font, current_player)

            # მისტერ X-ის სვლების ისტორია
            draw_mrx_history(mrx_transport_history, font)

            current_player = players[current_turn]
            if isinstance(current_player, Detective) and not current_player.has_valid_moves():
                current_turn = (current_turn + 1) % total_players
                if current_turn == 0:
                    rounds += 1
                needs_redraw = True
                continue

            # იგებენ დეტექტივები
            if check_collision(mrx, detectives):
                running = False
            
            # იგებს მისტერ X
            if rounds >= 24:
                show_game_over_popup("MrX Wins!")
                running = False

            pygame.display.flip()
            needs_redraw = False

if __name__ == "__main__":
    main()
