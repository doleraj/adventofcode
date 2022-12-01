package y2018

import org.junit.Assert.*
import org.junit.Test
import java.io.File

class day13Test {
    fun parseFile(name: String): List<List<String>> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines().map { s -> s.split("") }
    }

    @Test
    fun test1() {
        assertEquals(325, day13(listOf(listOf("|"), listOf("v"), listOf("|"), listOf("|"), listOf("|"), listOf("^"), listOf("|"))))
    }

//    @Test
//    fun test2() {
//        assertEquals(325, day13(parseFile("y2018/day13TestInput.txt")))
//    }

//    @Test
//    fun testActual() {
//        // 2589 - too low
//        assertEquals(2767, day12("..#..###...#####.#.#...####.#..####..###.##.#.#.##.#....#....#.####...#....###.###..##.#....#######",  parseFile("y2018/day12ActualInput.txt")))
//    }
//
//    @Test
//    fun testActualSecond() {
//        assertEquals(Pair(20, 34), day13Second("..#..###...#####.#.#...####.#..####..###.##.#.#.##.#....#....#.####...#....###.###..##.#....#######",  parseFile("y2018/day12ActualInput.txt")))
//    }
}