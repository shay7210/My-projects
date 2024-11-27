import math
import pygame
from csvExtractPath import cone_dots, path_line

#upload title, kart and cone images
car_image = pygame.image.load("images/kart.png")
cone_image = pygame.image.load("images/cone.png")
title_image = pygame.image.load("images/Title.png")
#set the size of the title, kart and the cone
car_image = pygame.transform.scale(car_image, (38,38))
cone_image = pygame.transform.scale(cone_image, (10, 10))
title_image = pygame.transform.scale(title_image, (300,100))
#inisilize pygame
pygame.init()

# Set up display
screen = pygame.display.set_mode((1500, 800))
pygame.display.set_caption("Bgu Racing Race Track Assignment 2")
#kart position
current_point_index = 0  # Start at the first point
# Car position (starting at the first point)
car_x, car_y = path_line[current_point_index]
speed = 3

# Set up the font
font = pygame.font.SysFont('Arial', 48)  # 'Arial' is the font, 48 is the size

# Create the text surface for theta (angle of the kart)
angle_text_surface = font.render('θ', True, (255, 255, 255))  # White text
positionX_text_surface = font.render('X', True, (255, 255, 255))  # White text
positionY_text_surface = font.render('Y', True, (255, 255, 255))
# Get the text position (top-left corner of the screen)
angle_text_rect = angle_text_surface.get_rect(center=(100, 200))  # Center of the screen
positionX_text_rect = angle_text_surface.get_rect(center=(100, 250))  # Center of the screen
positionY_text_rect = angle_text_surface.get_rect(center=(100, 300))  # Center of the screen

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:  # Check for the quit event
            running = False


    # Clear the screen
    screen.fill((0,0,0))  # RGB color: black

    #add title and information about the kart
    screen.blit(title_image, (80,50))
    screen.blit(angle_text_surface, angle_text_rect)
    screen.blit(positionX_text_surface, positionX_text_rect)
    screen.blit(positionY_text_surface, positionY_text_rect)

    #draw the cones in the correct positions
    for cone in cone_dots:
        screen.blit(cone_image, cone)


    # Get the current target point (next point to reach)
    target_x, target_y = path_line[current_point_index]
    # Calculate the distance between the car and the target point using current point and the next target point
    dx = target_x - car_x
    dy = target_y - car_y
    distance = math.sqrt(dx ** 2 + dy ** 2)  # Euclidean distance
    # Calculate the angle to rotate the car towards the target
    angle = math.degrees(math.atan2(dy, dx)) + 40  # Convert to degrees and fix the angle for this specific image

    if distance != 0: #this statement is for the first iteration where the distance is 0
        # Move the car towards the target point using linear interpolation
        dx_normalized = dx / distance  # Normalize the direction vector so the values stay in range
        dy_normalized = dy / distance  # Normalize the direction vector so the values stay in range

        # Update car position towards the target by speed units
        car_x += dx_normalized * speed
        car_y += dy_normalized * speed

    # Rotate the car to face the target direction
    rotated_car = pygame.transform.rotate(car_image, -angle)  # Negative angle for correct rotation direction
    rotated_rect = rotated_car.get_rect(center=(car_x, car_y))  # Keep the car centered at (car_x, car_y)

    # Draw the rotated car
    screen.blit(rotated_car, rotated_rect.topleft)


    pygame.display.flip()  # Update the screen
    #Set frame rate
    pygame.time.Clock().tick(60)
    # If the car reaches the current point, move to the next point
    if distance < speed:
        current_point_index += 1
    #reset the loop so the car keeps driving when reaching the end of the path points
    if current_point_index == len(path_line) - 1:
        current_point_index = 0
    #update text with current theta value
    angle_text_surface = font.render('θ = ' f'{round(angle, 3)}', True, (255, 255, 255))  # Re-render the text
    positionX_text_surface = font.render(f'X = {round(car_x,3)}', True, (255, 255, 255))
    positionY_text_surface = font.render(f'Y = {round(car_y,3)}', True, (255, 255, 255))
pygame.quit()  # Clean up and close the program
