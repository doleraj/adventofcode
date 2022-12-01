package y2017

import org.junit.Assert.assertEquals
import org.junit.Test

class day10Test {

    @Test
    fun testReverse() {
        val list = (0..4).toMutableList()
        reverse(list, 0, 3)
        assertEquals(listOf(2, 1, 0, 3, 4), list)
    }

    @Test
    fun testReverse2() {
        val list = mutableListOf(2, 1, 0, 3, 4)
        reverse(list, 3, 4)
        assertEquals(listOf(4, 3, 0, 1, 2), list)
    }

    @Test
    fun testReverse3() {
        val list = mutableListOf(4, 3, 0, 1, 2)
        reverse(list, 3, 1)
        assertEquals(listOf(4, 3, 0, 1, 2), list)
    }

    @Test
    fun testReverse4() {
        val list = mutableListOf(4, 3, 0, 1, 2)
        reverse(list, 1, 5)
        assertEquals(listOf(3, 4, 2, 1, 0), list)
    }

    @Test
    fun test1() {
        assertEquals(12, day10((0..4).toMutableList(), listOf(3, 4, 1, 5)))
    }

    @Test
    fun testActual() {
        assertEquals(20056, day10((0..255).toMutableList(), listOf(83, 0, 193, 1, 254, 237, 187, 40, 88, 27, 2, 255, 149, 29, 42, 100)))
    }

    @Test
    fun test1Second() {
        assertEquals("a2582a3a0e66e6e86e3812dcb672a272", day10Second(""))
    }

    @Test
    fun test2Second() {
        assertEquals("33efeb34ea91902bb2f59c9920caa6cd", day10Second("AoC 2017"))
    }

    @Test
    fun test3Second() {
        assertEquals("3efbe78a8d82f29979031a4aa0b16a9d", day10Second("1,2,3"))
    }

    @Test
    fun test4Second() {
        assertEquals("63960835bcdc130f0b66d7ff4f6a5a8e", day10Second("1,2,4"))
    }

    @Test
    fun testActualSecond() {
        assertEquals("d9a7de4a809c56bf3a9465cb84392c8e", day10Second("83,0,193,1,254,237,187,40,88,27,2,255,149,29,42,100"))
    }
}