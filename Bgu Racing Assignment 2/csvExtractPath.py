#This files purpose is to create the list of points to print as cones and create the path for the kart
import csv
# Path to the csv file
file_path = "BrandsHatchLayout.csv"
cone_dots = []

# Open and read the file
with open(file_path, mode='r') as file:
    reader = csv.reader(file)
    for row in reader:
        #collect the cone positions , ignore the first two lines, fix the location to fit the screen better
        if row[0] == 'x' or row[0] == '':continue
        cone_point = (float(row[0]) * 0.7 + 500, float(row[1]) * 0.7 + 700)
        cone_dots.append(cone_point)
    #path function creation
    path_line = []
    #Collects the dots for the outer and inner lines
    for i in range(156):
        # Average the points (coneDots[i] and coneDots[i + 156]) to create a path
        mid_x = (cone_dots[i][0] + cone_dots[i + 156][0]) / 2
        mid_y = (cone_dots[i][1] + cone_dots[i + 156][1]) / 2
        path_line.append((mid_x, mid_y))